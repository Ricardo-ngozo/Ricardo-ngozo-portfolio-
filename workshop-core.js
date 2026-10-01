(() => {
  "use strict";
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const read = (key, fallback, storage) => { try { return JSON.parse((storage === "session" ? window.sessionStorage : window.localStorage).getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value, storage) => { try { (storage === "session" ? window.sessionStorage : window.localStorage).setItem(key, JSON.stringify(value)); } catch {} };
  const preferences = read("ricardo:preferences:v1", {});
  let mode = preferences.motion === "calm" ? "calm" : "full";
  let sound = preferences.sound === true;
  let audio;
  const W = window.Workshop = {
    read, save,
    get calm() { return reduce.matches || mode === "calm"; },
    get sound() { return sound; },
    emit(name, detail) { document.dispatchEvent(new CustomEvent("workshop:" + name, {detail})); },
    el(tag, cls, text) { const e = document.createElement(tag); if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e; },
    tone(frequency = 440) {
      if (!sound) return;
      try {
        audio ||= new (window.AudioContext || window.webkitAudioContext)();
        if(audio.state === "suspended")audio.resume();
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.connect(gain);gain.connect(audio.destination);
        oscillator.frequency.value=frequency;oscillator.type="sine";
        gain.gain.setValueAtTime(.035,audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.13);
        oscillator.start();oscillator.stop(audio.currentTime+.14);
      } catch {}
    },
    async copy(value, trigger) {
      try { await navigator.clipboard.writeText(value); W.announce("Copied to clipboard."); if(trigger){const old=trigger.textContent;trigger.textContent="Copied";setTimeout(()=>trigger.textContent=old,1600);} }
      catch { const d=W.dialog("Copy this link or text");const field=W.el("textarea","copy-fallback");field.value=value;field.readOnly=true;d.content.append(field);d.show();field.focus();field.select(); }
    },
    announce(text) { if(W.status)W.status.textContent=text; },
    dialog(title) {
      const dialog=W.el("dialog","workshop-dialog"), head=W.el("div","dialog-head"), h=W.el("h2","",title), close=W.el("button","workshop-button","Close");
      const id="dialog-"+Math.random().toString(36).slice(2);
      h.id=id;dialog.setAttribute("aria-labelledby",id);close.type="button";close.setAttribute("aria-label","Close "+title);
      head.append(h,close);const content=W.el("div","dialog-content");dialog.append(head,content);document.body.append(dialog);
      let opener=document.activeElement;
      close.addEventListener("click",()=>dialog.close());
      dialog.addEventListener("click",e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
      dialog.addEventListener("close",()=>{document.body.classList.remove("dialog-open");opener?.focus?.();W.emit("dialogclosed",dialog);dialog.remove();});
      return {dialog,content,show(){opener=document.activeElement;dialog.showModal();document.body.classList.add("dialog-open");close.focus();}};
    },
    loop(element, tick, {manual=false}={}) {
      let visible=false,frame=0,last=0,stopped=false;
      const run=time=>{frame=0;if(stopped||document.hidden||!visible||(!manual&&W.calm))return;const dt=Math.min((time-last)/1000||.016,.04);last=time;tick(dt,time);frame=requestAnimationFrame(run);};
      const sync=()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(!stopped&&visible&&!document.hidden&&(manual||!W.calm))frame=requestAnimationFrame(run);};
      const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:"80px"});
      observer.observe(element);document.addEventListener("visibilitychange",sync);document.addEventListener("workshop:motion",sync);
      return ()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener("visibilitychange",sync);document.removeEventListener("workshop:motion",sync);};
    }
  };
  function apply() {
    root.dataset.motion=W.calm?"calm":"full";
    save("ricardo:preferences:v1",{motion:mode,sound});
    W.emit("motion",{calm:W.calm});
    document.querySelectorAll("[data-motion-choice]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.motionChoice===(W.calm?"calm":"full"))));
    const note=document.querySelector("[data-motion-note]");if(note)note.textContent=reduce.matches?"Your device’s reduced-motion preference is active.":"Your choice is saved on this device.";
  }
  apply();reduce.addEventListener("change",apply);
  function pong(host, onWin) {
    const canvas=W.el("canvas","rally-canvas");canvas.width=720;canvas.height=300;canvas.tabIndex=0;
    canvas.setAttribute("aria-label","Pong challenge. Move with Up and Down arrows, or drag on the court. Return five shots.");
    const controls=W.el("div","workshop-actions"), play=W.el("button","workshop-button","Start rally"), reset=W.el("button","workshop-button","Reset"), result=W.el("p","rally-score","Return five shots. No timer. Play whenever you like.");
    const up=W.el("button","workshop-button","Paddle up"),down=W.el("button","workshop-button","Paddle down");
    [play,reset,up,down].forEach(b=>b.type="button");controls.append(play,reset,up,down);host.append(canvas,controls,result);
    const ctx=canvas.getContext("2d");let running=false,y=115,other=115,x=360,by=150,vx=-220,vy=92,hits=0,won=false;
    const clamp=v=>Math.max(0,Math.min(230,v));
    function restart(){x=360;by=150;vx=-220;vy=92;y=115;hits=0;won=false;result.textContent="Return five shots. You control the left paddle.";paint();}
    function paint(){ctx.fillStyle="#101522";ctx.fillRect(0,0,720,300);ctx.strokeStyle="#394258";ctx.setLineDash([5,10]);ctx.beginPath();ctx.moveTo(360,0);ctx.lineTo(360,300);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#efbd73";ctx.fillRect(20,y,10,70);ctx.fillStyle="#c5b5ee";ctx.fillRect(690,other,10,70);ctx.fillStyle="#f6efe3";ctx.beginPath();ctx.arc(x,by,6,0,Math.PI*2);ctx.fill();}
    const stop=W.loop(canvas,dt=>{
      if(!running)return;other+=(by-35-other)*Math.min(1,dt*7);other=clamp(other);x+=vx*dt;by+=vy*dt;
      if(by<6){by=6;vy=Math.abs(vy);}if(by>294){by=294;vy=-Math.abs(vy);}
      if(x<36&&x>8&&vx<0&&by>=y-5&&by<=y+75){x=36;vx=Math.min(380,Math.abs(vx)*1.04);vy=(by-y-35)*5;hits++;W.tone(430+hits*45);result.textContent=hits+" / 5 returns";if(hits>=5&&!won){won=true;running=false;play.textContent="Play again";result.textContent="Five returns! Your workshop welcome is unlocked.";save("ricardo:rally",true);W.emit("reward");onWin?.();}}
      if(x>684&&vx>0&&by>=other-5&&by<=other+75){x=684;vx=-Math.abs(vx);}
      if(x<0||x>720){x=360;by=150;vx=-220;vy=92;result.textContent="Keep going — "+hits+" / 5 returns.";}
      paint();
    },{manual:true});
    play.addEventListener("click",()=>{if(won)restart();running=!running;play.textContent=running?"Pause rally":"Resume rally";canvas.focus();});
    reset.addEventListener("click",()=>{running=false;restart();play.textContent="Start rally";});
    const move=dy=>{y=clamp(y+dy);paint();};
    up.addEventListener("click",()=>move(-35));down.addEventListener("click",()=>move(35));
    canvas.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown"," "].includes(e.key)){e.preventDefault();if(e.key===" ")play.click();else move(e.key==="ArrowUp"?-28:28);}});
    const pointer=e=>{const r=canvas.getBoundingClientRect();y=clamp((e.clientY-r.top)*300/r.height-35);paint();};
    canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);pointer(e);});canvas.addEventListener("pointermove",e=>{if(e.pointerType==="mouse"||canvas.hasPointerCapture(e.pointerId))pointer(e);});
    paint();return stop;
  }
  W.openRally=()=>{const d=W.dialog("A little friendly competition");d.content.append(W.el("p","","Control the amber paddle. Five returns unlock a welcome from Ricardo’s avatar."));const stop=pong(d.content);d.dialog.addEventListener("close",stop,{once:true});d.show();};
  function init(){
    W.status=W.el("p","sr-only");W.status.setAttribute("role","status");W.status.setAttribute("aria-live","polite");document.body.append(W.status);
    const settings=W.el("details","workshop-settings"),summary=W.el("summary","","Experience"),panel=W.el("div","experience-panel"),row=W.el("div","workshop-actions");
    panel.append(W.el("strong","","Make yourself at home"));
    ["calm","full"].forEach(value=>{const b=W.el("button","workshop-button",value==="calm"?"Calm motion":"Full motion");b.type="button";b.dataset.motionChoice=value;b.addEventListener("click",()=>{mode=value;apply();});row.append(b);});
    const note=W.el("p","experience-note");note.dataset.motionNote="";panel.append(row,note);
    const audioButton=W.el("button","workshop-button",sound?"Sound on":"Sound off");audioButton.type="button";audioButton.setAttribute("aria-pressed",String(sound));audioButton.addEventListener("click",()=>{sound=!sound;audioButton.textContent=sound?"Sound on":"Sound off";audioButton.setAttribute("aria-pressed",String(sound));apply();W.tone();});
    const rally=W.el("button","workshop-button","Play a rally");rally.type="button";rally.addEventListener("click",()=>{settings.open=false;W.openRally();});panel.append(audioButton,rally);settings.append(summary,panel);document.body.append(settings);if(window.self!==window.top)settings.hidden=true;apply();
    document.addEventListener("pointerdown",e=>{if(!settings.contains(e.target))settings.open=false;});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")settings.open=false;});
    const loader=document.querySelector("[data-site-loader]");
    if(loader){
      let stopIntro=()=>{};
      const finish=()=>{stopIntro();loader.hidden=true;document.body.classList.remove("is-loading");document.body.classList.add("loader-complete");save("ricardo:entered",true,"session");};
      if(read("ricardo:entered",false,"session")||W.calm)finish();
      else{
        const intro=loader.querySelector("canvas"),ctx=intro?.getContext("2d");
        if(ctx){intro.width=900;intro.height=500;let t=0,hand=null;const draw=()=>{ctx.clearRect(0,0,900,500);const y=hand??(200+Math.sin(t)*120);ctx.fillStyle="#efbd73";ctx.fillRect(40,y,10,85);ctx.fillStyle="#c5b5ee";ctx.fillRect(850,200+Math.cos(t)*120,10,85);ctx.fillStyle="#f6efe3";ctx.beginPath();ctx.arc(450+Math.sin(t*2)*390,250+Math.cos(t)*120,6,0,7);ctx.fill();};draw();intro.addEventListener("pointermove",e=>{const r=intro.getBoundingClientRect();hand=Math.max(0,Math.min(415,(e.clientY-r.top)*500/r.height-42));});stopIntro=W.loop(intro,dt=>{t+=dt;draw();},{manual:true});}
        const skip=W.el("button","workshop-button loader-enter","Enter now");skip.type="button";
        const challenge=W.el("button","workshop-button loader-challenge","Play while you’re here");
        challenge.type="button";loader.append(skip,challenge);
        skip.addEventListener("click",finish);challenge.addEventListener("click",()=>{finish();W.openRally();});
        setTimeout(finish,1100);
      }
    }
    document.querySelectorAll("img").forEach(img=>{img.decoding="async";});
  }
  document.addEventListener("DOMContentLoaded",init,{once:true});
})();
