(() => {
  "use strict";
  const W=window.Workshop;if(!W)return;
  const COLORS=["#efbd73","#c5b5ee","#f6efe3","#dd927d"];
  const snapshots=W.read("ricardo:lab:v2",{}),progress=W.read("ricardo:lab-progress:v1",[]);
  const visited=new Set(Array.isArray(progress)?progress:[]);
  const query=new URLSearchParams(location.search),active=Number(query.get("experiment"));
  const explanations=[
    "Speed changes how far the turtle travels each second. It reverses at either edge.",
    "Velocity has two components. The horizontal or vertical component flips when the ball hits that boundary.",
    "Each ball keeps its own position and velocity. Count changes how many independent objects the loop updates.",
    "The controls change coordinates. The player is clamped inside the canvas, so it cannot leave the stage.",
    "Particles drift downward and respawn above the canvas. Count changes density; speed changes their fall rate.",
    "Position wraps from the right edge to the left. This browser demo illustrates a continuous game loop.",
    "Move to avoid the falling blocks. Passing a block adds a point. Speed changes the difficulty.",
    "Each bird combines separation, alignment, and cohesion. Count changes the flock size; speed limits its motion.",
    "Gravity pulls particles down while drag slows horizontal movement. Click or tap the canvas to launch."
  ];
  const overview=W.el("aside","lab-progress"),title=W.el("h3","","Your lab notebook"),status=W.el("p"),resume=W.el("a","workshop-button","Return to last experiment"),clear=W.el("button","workshop-button","Clear saved progress");
  clear.type="button";overview.append(title,status,resume,clear);document.querySelector(".timeline-intro")?.before(overview);
  function updateProgress(){status.textContent=visited.size+" of 9 experiments explored · saved only in this browser";const last=W.read("ricardo:lab-last",1);resume.href="#experiment-"+Math.max(1,Math.min(9,Number(last)||1));}
  clear.addEventListener("click",()=>{visited.clear();W.save("ricardo:lab-progress:v1",[]);W.save("ricardo:lab:v2",{});W.save("ricardo:lab-last",1);updateProgress();W.announce("Saved progress and settings cleared. Current experiments are unchanged until reload.");});
  updateProgress();
  const finite=(v,f,min,max)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):f;
  const phases=[...document.querySelectorAll(".phase")];
  phases.forEach((phase,idx)=>{
    const n=idx+1;phase.id="experiment-"+n;
    const canvas=phase.querySelector("canvas"),ctx=canvas.getContext("2d"),width=canvas.width,height=canvas.height;
    canvas.tabIndex=0;canvas.setAttribute("role","img");canvas.setAttribute("aria-label","Interactive "+phase.querySelector("h3").textContent+". Controls follow the canvas.");
    const saved=snapshots?.[n]||{};
    const settings={speed:finite(active===n?query.get("speed")??saved.speed:saved.speed,1,.25,2),count:Math.round(finite(active===n?query.get("count")??saved.count:saved.count,n===8?30:n===5?36:10,4,60)),gravity:finite(active===n?query.get("gravity")??saved.gravity:saved.gravity,90,0,240)};
    let running=!W.calm,objects=[],player=width/2,py=height/2,elapsed=0,spawn=0,score=0,over=false;
    const controls=W.el("div","lab-controls"),actions=W.el("div","workshop-actions"),play=W.el("button","workshop-button",running?"Pause":"Play"),reset=W.el("button","workshop-button","Reset"),share=W.el("button","workshop-button","Share settings"),copy=W.el("button","workshop-button","Copy Python excerpt");
    [play,reset,share,copy].forEach(b=>b.type="button");actions.append(play,reset,share,copy);controls.append(actions);
    const readout=W.el("p","lab-readout",explanations[idx]);readout.setAttribute("aria-live","polite");
    const knob=(key,label,min,max,step)=>{
      const l=W.el("label","lab-knob",label+" "),output=W.el("output","",String(settings[key])),input=W.el("input");
      input.type="range";input.min=min;input.max=max;input.step=step;input.value=settings[key];input.setAttribute("aria-label",label+" for experiment "+n);
      input.addEventListener("input",()=>{settings[key]=Number(input.value);output.value=input.value;persist();if(key==="count")resetState();readout.textContent=explanations[idx]+" "+label+": "+input.value+".";draw();});
      l.append(output,input);controls.append(l);
    };
    knob("speed","Speed",.25,2,.25);
    if([3,5,8,9].includes(n))knob("count","Count",4,60,1);
    if(n===9)knob("gravity","Gravity",0,240,10);
    if(n===4||n===7){
      const movement=W.el("div","workshop-actions");
      [["Left",-22,0],["Right",22,0],...(n===4?[["Up",0,-18],["Down",0,18]]:[])].forEach(([label,x,y])=>{
        const b=W.el("button","workshop-button",label);b.type="button";b.setAttribute("aria-label","Move "+label.toLowerCase()+" in experiment "+n);b.addEventListener("click",()=>move(x,y));movement.append(b);
      });controls.append(movement);
    }
    if(n===9){const launchButton=W.el("button","workshop-button","Launch firework");launchButton.type="button";launchButton.addEventListener("click",()=>launch(width/2,height*.35));controls.append(launchButton);}
    const checked=W.el("label","lab-complete"),checkbox=W.el("input");checkbox.type="checkbox";checkbox.checked=visited.has(n);
    checkbox.addEventListener("change",()=>{if(checkbox.checked)visited.add(n);else visited.delete(n);W.save("ricardo:lab-progress:v1",[...visited]);updateProgress();});
    checked.append(checkbox,document.createTextNode(" Mark as explored"));controls.append(checked,readout);phase.querySelector(".phase-body").append(controls);
    const code=phase.querySelector("code[data-code]"),snippet=window.PYTHON_SNIPPETS?.["l"+n]||"";
    if(code)code.textContent=snippet;
    const source=W.el("a","lab-source","View this browser simulation’s source");source.href="https://github.com/Ricardo-ngozo/Ricardo-ngozo-portfolio-/blob/main/python-lab.js";source.target="_blank";source.rel="noopener noreferrer";controls.append(source);
    function persist(){const all=W.read("ricardo:lab:v2",{});W.save("ricardo:lab:v2",{...all,[n]:settings});W.save("ricardo:lab-last",n);updateProgress();}
    function mark(){visited.add(n);checkbox.checked=true;W.save("ricardo:lab-progress:v1",[...visited]);persist();W.emit("lab",{phase:n});}
    function resetState(){
      objects=[];player=width/2;py=height/2;score=0;over=false;elapsed=0;spawn=0;
      const count=n===3||n===5||n===8?settings.count:1;
      for(let i=0;i<count;i++)objects.push({x:20+Math.random()*(width-40),y:20+Math.random()*(height-40),vx:(Math.random()-.5)*110||35,vy:(Math.random()-.5)*90||35,color:COLORS[i%4],life:1});
      if(n===7||n===9)objects=[];
      readout.textContent=explanations[idx];draw();
    }
    function move(dx,dy){if(over)return;player=Math.max(14,Math.min(width-14,player+dx));py=Math.max(14,Math.min(height-14,py+dy));mark();draw();}
    function launch(x,y){for(let i=0;i<settings.count;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*130;objects.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color:COLORS[i%4]});}objects=objects.slice(-360);mark();if(!running){running=true;play.textContent="Pause";}W.tone(680);}
    play.addEventListener("click",()=>{if(over)resetState();running=!running;play.textContent=running?"Pause":"Play";mark();});
    reset.addEventListener("click",()=>{resetState();mark();});
    share.addEventListener("click",()=>{const url=new URL(location.href);url.search="";url.searchParams.set("experiment",n);Object.entries(settings).forEach(([k,v])=>url.searchParams.set(k,String(v)));url.hash="experiment-"+n;W.copy(url.href,share);});
    copy.addEventListener("click",()=>W.copy(snippet,copy));
    canvas.addEventListener("keydown",e=>{
      const map={ArrowLeft:[-18,0],ArrowRight:[18,0],ArrowUp:[0,-18],ArrowDown:[0,18]};
      if((n===4||n===7)&&map[e.key]){e.preventDefault();move(...map[e.key]);}
      if(n===9&&(e.key===" "||e.key==="Enter")){e.preventDefault();launch(width/2,height*.35);}
    });
    canvas.addEventListener("pointerdown",e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*width/r.width,y=(e.clientY-r.top)*height/r.height;if(n===9)launch(x,y);if(n===4||n===7){player=Math.max(14,Math.min(width-14,x));py=Math.max(14,Math.min(height-14,y));mark();draw();}});
    function flock(dt){
      const velocities=objects.map(b=>{
        let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,count=0;
        for(const o of objects){if(o===b)continue;const dx=o.x-b.x,dy=o.y-b.y,d=Math.hypot(dx,dy);if(d<65&&d>0){if(d<18){sx-=dx/d;sy-=dy/d;}ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;count++;}}
        let vx=b.vx,vy=b.vy;if(count){vx+=(sx*60+(ax/count-vx)*.5+(cx/count-b.x)*.5)*dt;vy+=(sy*60+(ay/count-vy)*.5+(cy/count-b.y)*.5)*dt;}
        const speed=Math.hypot(vx,vy)||1,limit=60;return {vx:vx/speed*Math.min(speed,limit),vy:vy/speed*Math.min(speed,limit)};
      });
      objects.forEach((b,i)=>{Object.assign(b,velocities[i]);b.x=(b.x+b.vx*dt+width)%width;b.y=(b.y+b.vy*dt+height)%height;});
    }
    function step(dt){
      elapsed+=dt;
      if(n===7){
        if(over)return;spawn+=dt;if(spawn>.7){spawn=0;objects.push({x:10+Math.random()*(width-20),y:-10});}
        objects.forEach(b=>{b.y+=(55+score*3)*dt;if(Math.abs(b.x-player)<23&&Math.abs(b.y-(height-16))<12){over=true;running=false;play.textContent="Try again";readout.textContent="Round complete. Score: "+score+". Press Try again or Reset.";W.tone(180);}});
        objects=objects.filter(b=>{if(b.y>height+10){score++;return false;}return true;});return;
      }
      if(n===8){flock(dt);return;}
      if(n===4)return;
      objects.forEach(b=>{
        if(n===1){b.x=width/2+Math.sin(elapsed)*Math.min(130,width*.4);b.y=height/2;}
        else if(n===5){b.y+=35*dt;b.x+=Math.sin(elapsed+b.y*.02)*8*dt;if(b.y>height){b.y=-3;b.x=Math.random()*width;}}
        else if(n===6){b.x=(b.x+95*dt)%width;b.y=height/2;}
        else if(n===9){b.vy+=settings.gravity*dt;b.vx*=Math.pow(.65,dt);b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt*.6;}
        else{b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<7){b.x=7;b.vx=Math.abs(b.vx);}if(b.x>width-7){b.x=width-7;b.vx=-Math.abs(b.vx);}if(b.y<7){b.y=7;b.vy=Math.abs(b.vy);}if(b.y>height-7){b.y=height-7;b.vy=-Math.abs(b.vy);}}
      });
      if(n===9)objects=objects.filter(b=>b.life>0);
    }
    function draw(){
      ctx.fillStyle="#101522";ctx.fillRect(0,0,width,height);
      ctx.strokeStyle="rgba(197,181,238,.06)";ctx.lineWidth=1;for(let x=0;x<width;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
      for(const b of objects){ctx.fillStyle=b.color||"#efbd73";ctx.globalAlpha=n===9?Math.max(0,b.life):1;
        if(n===8){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,4);ctx.lineTo(-3,0);ctx.lineTo(-5,-4);ctx.closePath();ctx.fill();ctx.restore();}
        else if(n===7)ctx.fillRect(b.x-7,b.y-7,14,14);
        else{ctx.beginPath();ctx.arc(b.x,b.y,n===5?1.7:n===9?2.4:7,0,Math.PI*2);ctx.fill();}
      }
      ctx.globalAlpha=1;
      if(n===4||n===7){ctx.fillStyle=over?"#dd927d":"#c5b5ee";ctx.fillRect(player-14,n===7?height-22:py-10,28,n===7?10:20);}
      if(n===7){ctx.fillStyle="#f6efe3";ctx.font="12px monospace";ctx.fillText("Score "+score,10,18);}
    }
    resetState();W.loop(canvas,dt=>{if(running){step(dt*settings.speed);draw();}},{manual:true});
    document.addEventListener("workshop:motion",()=>{if(W.calm){running=false;play.textContent="Play";}});
  });
  if(active>=1&&active<=9)requestAnimationFrame(()=>document.getElementById("experiment-"+active)?.scrollIntoView({block:"start"}));
  const hero=document.getElementById("c-hero");if(hero){const ctx=hero.getContext("2d");let t=0;const paint=()=>{ctx.fillStyle="#101522";ctx.fillRect(0,0,hero.width,hero.height);ctx.strokeStyle="#394258";ctx.beginPath();ctx.ellipse(180,110,120,65,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#efbd73";ctx.beginPath();ctx.arc(180+Math.cos(t)*120,110+Math.sin(t)*65,9,0,Math.PI*2);ctx.fill();};paint();W.loop(hero,dt=>{t+=dt*.8;paint();});}
})();
