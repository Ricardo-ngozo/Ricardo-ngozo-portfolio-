(() => {
  "use strict";
  const W=window.Workshop;if(!W)return;
  function init(){
    const hero=document.querySelector(".hero-section,.p-hero"),avatar=hero?.querySelector("[data-avatar-interactive],[data-character]");
    if(hero&&avatar){
      const greeting=W.el("p","avatar-greeting","Welcome to my workshop. Have a look around.");greeting.setAttribute("aria-live","polite");
      const bubble=W.el("div","hero-welcome");bubble.append(greeting);avatar.after(bubble);
      const welcome=()=>{greeting.textContent=W.read("ricardo:rally",false)?"Five returns. Nicely played — welcome to the workshop!":"Hey, I’m Ricardo. Pick a project, spin the globe, or try the lab.";avatar.classList.add("is-awake");W.tone(520);};
      if(avatar.hasAttribute("data-character"))document.addEventListener("character:reaction",e=>{if(e.detail.source==="wave")welcome();});else avatar.addEventListener("click",welcome);document.addEventListener("workshop:reward",welcome);
      if(W.read("ricardo:rally",false))welcome();
      const bird=W.el("button","perched-bird");bird.type="button";bird.setAttribute("aria-label","Say hello to Ricardo’s bird");
      bird.innerHTML='<svg viewBox="0 0 110 74" aria-hidden="true"><defs><linearGradient id="welcome-bird" x2=".8" y2="1"><stop stop-color="#fff1d5"/><stop offset=".5" stop-color="#ff624b"/><stop offset="1" stop-color="#956640"/></linearGradient></defs><ellipse cx="55" cy="64" rx="28" ry="4" fill="#0d0d0f" opacity=".5"/><path d="M19 44Q29 7 63 27Q77 6 91 24L105 29 91 35Q85 58 58 56L31 53 10 60Z" fill="url(#welcome-bird)"/><path class="perched-wing" d="M26 40Q39 15 71 36Q62 57 31 52Z" fill="#8b9eff"/><circle cx="85" cy="24" r="2.5" fill="#0d0d0f"/><path d="m56 56-3 8m14-9 3 9" fill="none" stroke="#ff624b" stroke-width="3"/></svg>';
      bird.addEventListener("click",()=>{welcome();bird.classList.toggle("bird-awake");});hero.querySelector(".hero-identity,.p-hero-content")?.prepend(bird);
      if(hero.id==="home"){const path=W.el("a","workshop-path");path.href="#stack";path.innerHTML='<span>Follow the curiosity</span><svg viewBox="0 0 120 68" aria-hidden="true"><path d="M9 4c96 0 96 35 51 35S24 64 60 64m-7-7 7 7 7-7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';hero.append(path);W.loop(hero,()=>{const bounds=hero.getBoundingClientRect();hero.style.setProperty("--path-progress",String(Math.max(0,Math.min(1,-bounds.top/Math.max(1,bounds.height*.65)))));});}
    }
    document.querySelectorAll(".section-companion").forEach((button,i)=>{
      const section=button.parentElement;if(section.matches(".hero-section,.p-hero,header.hero")){button.hidden=true;return;}
      const kind=[...button.classList].find(c=>c.startsWith("section-companion--"))?.replace("section-companion--","")||"friend";
      const habitat=W.el("div","companion-habitat"),caption=W.el("p","pet-caption",kind[0].toUpperCase()+kind.slice(1)+" on duty");
      const anchor=section.querySelector(":scope > .chapter-line");
      if(anchor)anchor.after(habitat);else section.append(habitat);
      habitat.append(button,caption);button.classList.remove("companion-left");button.classList.add("workshop-pet");
      const svg=button.querySelector("svg");if(svg){const ns="http://www.w3.org/2000/svg",defs=document.createElementNS(ns,"defs"),g=document.createElementNS(ns,"linearGradient");g.id="pet-coat-"+i;g.setAttribute("x2",".8");g.setAttribute("y2","1");[["0","#fff1d5"],[".5",i%2?"#8b9eff":"#ff624b"],["1",i%2?"#75648e":"#9b6a40"]].forEach(([offset,color])=>{const stop=document.createElementNS(ns,"stop");stop.setAttribute("offset",offset);stop.setAttribute("stop-color",color);g.append(stop);});defs.append(g);svg.prepend(defs);svg.style.fill="url(#"+g.id+")";}
      button.addEventListener("click",()=>{caption.textContent="Hello from the "+kind+".";W.tone(370+i*24);});
      if(section.id==="projects"){
        section.querySelectorAll(".fw-card").forEach(card=>{
          const follow=()=>{caption.textContent="Inspecting "+card.querySelector("h3").textContent;habitat.style.setProperty("--pet-lean",((card.offsetLeft/Math.max(1,section.clientWidth))-.3)*15+"deg");button.classList.add("is-awake");};
          card.addEventListener("pointerenter",follow);card.addEventListener("focusin",follow);
          card.addEventListener("pointerleave",()=>button.classList.remove("is-awake"));
        });
      }
      if(section.id==="stack"){
        document.addEventListener("workshop:globe",e=>{caption.textContent="Following "+e.detail.label;const globe=section.querySelector(".tech-globe-wrap");if(globe){globe.append(button);button.classList.add("globe-orbit-pet");button.style.setProperty("--pet-x",e.detail.x+"px");button.style.setProperty("--pet-y",e.detail.y+"px");}button.classList.add("is-awake");setTimeout(()=>button.classList.remove("is-awake"),800);});
      }
      if(section.id==="archive"){
        const toggle=section.querySelector("[data-archive-toggle]");
        const update=()=>{const open=toggle?.getAttribute("aria-expanded")==="true";button.classList.toggle("is-awake",open);caption.textContent=open?"The archive is open. The cat is curious.":"A quiet cat, keeping the archive."};
        if(toggle)new MutationObserver(update).observe(toggle,{attributes:true,attributeFilter:["aria-expanded"]});update();
      }
      if(section.classList.contains("phase")){
        document.addEventListener("workshop:lab",e=>{if(section.id!=="experiment-"+e.detail.phase)return;caption.textContent="Experiment "+e.detail.phase+" in motion";button.classList.add("is-awake");setTimeout(()=>button.classList.remove("is-awake"),700);});
      }
    });
    const runway=document.querySelector(".motion-runway"),dog=runway?.querySelector(".motion-runner");
    if(runway&&dog){
      runway.classList.add("fetch-runway");
      const ball=W.el("button","fetch-ball");ball.type="button";ball.setAttribute("aria-label","Throw the ball for the dog. Drag it or use Left and Right arrows.");
      const hint=W.el("p","fetch-hint","A little fetch? Drag the ball, tap the path, or use the arrow keys.");
      runway.append(ball,hint);let target=.65,position=.2,drag=false;dog.setAttribute("aria-label","Pet the dog");
      const set=value=>{target=Math.max(.07,Math.min(.9,value));ball.style.left=target*100+"%";if(W.calm){position=target-.075;dog.style.left=position*100+"%";dog.classList.remove("is-fetching");}};
      const point=e=>{const r=runway.getBoundingClientRect();set((e.clientX-r.left)/r.width);};
      ball.addEventListener("pointerdown",e=>{drag=true;ball.setPointerCapture(e.pointerId);point(e);});
      ball.addEventListener("pointermove",e=>{if(drag)point(e);});ball.addEventListener("pointerup",()=>{drag=false;W.tone(320);});ball.addEventListener("pointercancel",()=>drag=false);
      ball.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();set(target+(e.key==="ArrowLeft"?-.08:.08));}});
      runway.addEventListener("pointerdown",e=>{if(e.target===runway)point(e);});
      dog.addEventListener("click",()=>{hint.textContent="A good dog. A very good dog.";W.tone(400);});
      set(target);dog.style.left=position*100+"%";
      document.addEventListener("workshop:motion",()=>{if(W.calm)set(target);});
      W.loop(runway,dt=>{const desired=target-.075,delta=desired-position;position+=Math.sign(delta)*Math.min(Math.abs(delta),dt*.15);dog.style.left=position*100+"%";dog.style.setProperty("--dog-direction",delta<-.002?"-1":"1");dog.classList.toggle("is-fetching",Math.abs(delta)>.005);});
    }
  }
  if(document.readyState==="complete")init();else document.addEventListener("DOMContentLoaded",init,{once:true});
})();
