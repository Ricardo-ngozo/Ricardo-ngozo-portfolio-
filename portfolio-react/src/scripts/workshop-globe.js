export function initGlobe(scope) {
'use strict';
const W=scope.workshop(),canvas=document.getElementById('tech-globe');if(!W||!canvas)return;
  const NODES = [
    // Frontend — cyan
    { label:'HTML5',      cat:'fe', icon:'M4 2h16l-1.5 16.5L12 21l-6.5-2.5L4 2zm2.3 2 .9 10.5 4.8 1.4 4.8-1.4.6-6.5H8.3l-.2-2h8.7l.2-2H6.3zm.5 6h4.4l.1 1.5-3.1.9-.2-2.4zm5.3-2-.1-2h1.9l-.2 2h-1.6z' },
    { label:'CSS3',       cat:'fe', icon:'M4 2h16l-1.5 16.5L12 21l-6.5-2.5L4 2zm6.1 10.5-.1-1.5H8.3l.3 3.5 3.4.9 3.4-.9.4-4.5H9.6l-.1-2h5.6l.1-1.5H8l.3 3.5h5.5l-.2 2.5-1.6.4-1.6-.4z' },
    { label:'JavaScript', cat:'fe', icon:'M3 3h18v18H3V3zm4.7 14.7 1.4-1.4c.3.5.5.8 1.1.8.6 0 .9-.3.9-1.3v-5.6h1.8v5.7c0 2.1-1.2 3.1-2.9 3.1-1.5 0-2.4-.8-2.8-1.8v-.5zm6.6-.3 1.4-1.4c.5.8 1.1 1.3 2.2 1.3 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.7-1.6l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.3-3 1.4 0 2.4.5 3.1 1.8l-1.4 1.5c-.4-.7-.8-1-1.7-1-.7 0-1.2.4-1.2 1 0 .7.4 1 1.5 1.5l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.1-2.3z' },
    { label:'React',      cat:'fe', icon:'M12 10.7a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm0-8.2c1 0 2 .5 2.7 1.3 2.3-.5 4.7-.1 6.2 1.2 1.5 1.2 2 3.6 1.4 6 .6 2.3.1 4.7-1.4 6-1.5 1.3-3.9 1.7-6.2 1.2-.7.8-1.7 1.3-2.7 1.3s-2-.5-2.7-1.3c-2.3.5-4.7.1-6.2-1.2-1.5-1.3-2-3.7-1.4-6-.6-2.4-.1-4.8 1.4-6C4.6 2.7 7 2.3 9.3 2.8 10 2 11 1.5 12 1.5zm0 2c-.5 0-1.1.3-1.6.9l-.5.6-.7-.2c-2-.5-3.9-.2-4.9.7S3 7.7 3.5 9.7l.2.7-.2.7c-.5 2-.2 3.8.8 4.7 1 .8 2.9 1.1 4.9.7l.7-.2.5.6c.5.6 1.1.9 1.6.9s1.1-.3 1.6-.9l.5-.6.7.2c2 .4 3.9.1 4.9-.7 1-.9 1.3-2.7.8-4.7l-.2-.7.2-.7c.5-2 .2-3.8-.8-4.7-1-.9-2.9-1.2-4.9-.7l-.7.2-.5-.6c-.5-.6-1.1-.9-1.6-.9zm5.7 5.1c.9 1.6 1.4 3.2 1.4 4.4s-.5 2.8-1.4 4.4c-.9-1.6-1.4-3.2-1.4-4.4s.5-2.8 1.4-4.4zM6.3 8.6C5.4 10.2 5 11.8 5 13s.4 2.8 1.3 4.4C7.2 15.8 7.7 14.2 7.7 13s-.5-2.8-1.4-4.4zM12 6.9c1.2 0 2.8.5 4.4 1.4-1.6.9-3.2 1.4-4.4 1.4S9.2 9.2 7.6 8.3c1.6-.9 3.2-1.4 4.4-1.4zm0 9.8c1.2 0 2.8-.5 4.4-1.4-1.6-.9-3.2-1.4-4.4-1.4s-2.8.5-4.4 1.4c1.6.9 3.2 1.4 4.4 1.4z' },
    { label:'Tailwind',   cat:'fe', icon:'M12 6C9.3 6 7.6 7.3 6.8 10c1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.5.9 2.2 1.7.9 1.1 2.5 2.1 4 1.8 2.7-.5 4.4-1.8 5.2-4.5-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.5-.9-2.2-1.7C15 6.2 13.4 6 12 6zM6.8 14C4.1 14 2.4 15.3 1.6 18c1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.5.9 2.2 1.7.9 1.1 2.5 2.1 4 1.8 2.7-.5 4.4-1.8 5.2-4.5-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.5-.9-2.2-1.7C11.9 14.2 10.3 14 8.8 14H6.8z' },
    // Backend — purple
    { label:'Node.js',    cat:'be', icon:'M12 1.8L2 7.2v9.6l10 5.4 10-5.4V7.2L12 1.8zM6.7 15.5l-1.6-2.8c-.1-.2-.1-.4 0-.6l3.5-6c.2-.3.5-.5.8-.5h3.2c.3 0 .6.2.8.5l.7 1.2-2 1.1-.4-.7H9.5l-2.4 4.1.4.7-1.6 2.8zm5.3 1.2l-2.7-4.6h3.4l2.7 4.6H12zm4-1.2l-1.6-2.8.4-.7-2.4-4.1H11l-.4.7-2-1.1.7-1.2c.2-.3.5-.5.8-.5h3.2c.3 0 .6.2.8.5l3.5 6c.1.2.1.4 0 .6l-1.6 2.8z' },
    { label:'Python',     cat:'be', icon:'M12 1.5c-2.4 0-4 .4-4.8 1.1-.8.7-1.2 1.7-1.2 3v1.9h6v.6H5.3C3.9 8.1 3 9 3 11.5c0 2.4.9 3.8 2.7 4.1.4.1.8.1 1.3.1v-2.2c0-1.1.5-1.9 1.4-2.1h4.8c.7 0 1.3-.3 1.7-.7.4-.4.6-1 .6-1.7V5.6c0-.8-.3-1.5-.9-2-.6-.5-1.5-.7-2.6-.7l-.5.6zm-2.2 2c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8zm4.4 5.1h4.5c1.4 0 2.3.9 2.3 3.4s-.9 3.8-2.7 4.1c-.4.1-.8.1-1.3.1v2.2c0 1.1-.5 1.9-1.4 2.1H11c-.7 0-1.3.3-1.7.7-.4.4-.6 1-.6 1.7v3.4c0 .8.3 1.5.9 2 .6.5 1.5.7 2.6.7 2.4 0 4-.4 4.8-1.1.8-.7 1.2-1.7 1.2-3v-1.9h-6v-.6h6.7c1.4 0 2.3-.9 2.3-3.4s-.9-3.8-2.7-4.1c-.4-.1-.8-.1-1.3-.1v2.2c0-1.1-.5-1.9-1.4-2.1H11c-.7 0-1.3-.3-1.7-.7-.4-.4-.6-1-.6-1.7V8.6zm2.2 8.4c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8z' },
    // Tools — green
    { label:'Git',        cat:'tools', icon:'M2.6 10.6 1.2 12l11.4 10.8 9-9.6-1.4-1.4-7.6 8.2L3.4 11l-.8-.4zm.8-5L2 7l11.4 10.8L22.8 8 21.4 6.6 13 15.4 4.8 6.8l-1.4-1.2zM12 5.4 9.4 8 12 10.6 14.6 8 12 5.4z' },
    { label:'GitHub',     cat:'tools', icon:'M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z' },
    { label:'Vite',       cat:'tools', icon:'M13.1 1.2 4.7 16.4c-.2.3 0 .6.3.6h1.6c.2 0 .4-.1.5-.3l1-1.8h4.5l-3.6-6.2 3.4-5.9.8 1.4L15.5 8l-.9 1.5h5.9c.3 0 .5-.3.3-.6L13.7 1.2c-.2-.3-.5-.3-.6 0zM12 14.4l-1.4 2.4c-.1.2.1.4.3.4h2.2c.2 0 .3-.2.3-.4L12 14.4zM21.9 7H19l-1 1.8-1.5 2.5 3.1 5.3c.2.3-.1.6-.4.6H17c-.2 0-.4-.1-.5-.3L15 14l-1.2 2.1 2.6 4.6c.2.3.5.3.7 0l5.2-9c.2-.3 0-.7-.4-.7z' },
    { label:'Figma',      cat:'tools', icon:'M8 2a3 3 0 0 0 0 6h3V2H8zm3 0h3a3 3 0 0 1 0 6h-3V2zm3 8a3 3 0 1 1 0 6h-3v-6h3zM11 10H8a3 3 0 0 0 0 6h3v-6zm0 8H8a3 3 0 0 0 0 6v-3a3 3 0 0 1 3-3z' },
    { label:'REST API',   cat:'tools', icon:'M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4zm2 4h2v2H6V9zm0 4h2v2H6v-2zm3-4h2v2H9V9zm0 4h2v2H9v-2zm3-4h4v2h-4V9zm0 4h4v2h-4v-2z' },
    { label:'Responsive', cat:'tools', icon:'M3 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6v2H7v2h10v-2h-2v-2h.5A1.5 1.5 0 0 0 17 15.5V14h3a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H3zm0 2h14v6H3V7zm14 5v1.5a.5.5 0 0 1-.5.5H17v-2h0zm2-5h1v5h-1V7z' },
  ];
  const ctx=canvas.getContext("2d");
  const descriptions={
    HTML5:["Semantic structure, forms, and content that works across devices.","HTML"],
    CSS3:["Responsive layouts, visual systems, and the motion throughout this portfolio.","CSS"],
    JavaScript:["Interface state, API requests, and browser game loops.","JavaScript"],
    React:["Component-based interfaces in Urban Threads and Game UI Setup.","React"],
    Tailwind:["Utility-first styling in my toolkit. Browse the case studies for each project’s exact stack.","UI"],
    "Node.js":["Part of my fullstack direction. Project build notes explain the server-side scope.","Airbnb"],
    Python:["From coordinates and loops to flocking and particle physics. Explore the learning lab.","Python"],
    Git:["Version control and incremental changes across the projects.",""],
    GitHub:["Source code and public contribution activity.",""],
    Vite:["A development tool in my frontend toolkit. See project repositories for configuration.","React"],
    Figma:["Interface planning and prototyping. Explore the iHub design work.","iHub"],
    "REST API":["Fetching external data and shaping it into useful interfaces.","API"],
    Responsive:["Interfaces that adapt to the screen, content, and input method.","Responsive"]
  };
  const colors={fe:"#ff624b",be:"#8b9eff",tools:"#f3f0e9"};
  const controls=W.el("div","globe-controls"),pause=W.el("button","workshop-button","Pause orbit"),list=W.el("details","technology-list"),summary=W.el("summary","","Explore technologies as a list"),buttons=W.el("div","technology-buttons"),detail=W.el("aside","technology-detail");
  detail.hidden=true;detail.setAttribute("aria-live","polite");
  pause.type="button";pause.setAttribute("aria-pressed","false");
  const wrap=canvas.parentElement;wrap.after(controls,list,detail);controls.append(pause);list.append(summary,buttons);
  const hint=W.el("p","experience-note","Drag to spin · select a node · use arrow keys to explore");controls.append(hint);
  canvas.tabIndex=0;canvas.setAttribute("role","group");canvas.setAttribute("aria-label","Interactive technology globe. Use Left and Right arrows to select a technology. The list below provides the same choices.");
  let angle=0,playing=true,index=-1,size=400,points=[],dragging=false,last=0,travel=0;
  const golden=Math.PI*(3-Math.sqrt(5));
  NODES.forEach((n,i)=>{n.phi=Math.acos(1-2*(i+.5)/NODES.length);n.theta=golden*i;const b=W.el("button","workshop-button",n.label);b.type="button";b.setAttribute("aria-pressed","false");scope.listen(b, "click",()=>select(i));buttons.append(b);});
  function select(i){
    index=(i+NODES.length)%NODES.length;const n=NODES[index];playing=false;angle=Math.PI/2-n.theta;pause.textContent="Resume orbit";pause.setAttribute("aria-pressed","true");
    [...buttons.children].forEach((b,j)=>b.setAttribute("aria-pressed",String(j===index)));
    detail.hidden=false;detail.replaceChildren();
    detail.append(W.el("p","section-kicker","IN THE WORKSHOP"),W.el("h3","",n.label),W.el("p","",descriptions[n.label][0]));
    const action=W.el("a","workshop-button",n.label==="Python"?"Open the Python lab":n.label==="GitHub"?"See contribution activity":"Explore related work");
    action.href=n.label==="Python"?"/python-learning-log":n.label==="GitHub"?"#contributions":"#projects";
    if(n.label!=="Python"&&n.label!=="GitHub")scope.listen(action, "click",()=>W.emit("technology",{label:n.label,search:descriptions[n.label][1]}));
    detail.append(action);draw();const point=points.find(p=>p.i===index);W.emit("globe",{label:n.label,index,x:point?.x||size/2,y:point?.y||size/2});W.tone(420+index*18);
  }
  scope.listen(pause, "click",()=>{playing=!playing;pause.textContent=playing?"Pause orbit":"Resume orbit";pause.setAttribute("aria-pressed",String(!playing));});
  scope.listen(canvas, "keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();select(e.key==="Home"?0:e.key==="End"?NODES.length-1:index+(e.key==="ArrowLeft"?-1:1));}});
  function resize(){size=Math.min(560,wrap.clientWidth);const ratio=Math.min(devicePixelRatio||1,2);canvas.width=size*ratio;canvas.height=size*ratio;canvas.style.width=size+"px";canvas.style.height=size+"px";ctx.setTransform(ratio,0,0,ratio,0,0);draw();}
  function draw(){
    if(!size)return;ctx.clearRect(0,0,size,size);const center=size/2,r=size*.34;
    ctx.strokeStyle="rgba(139,158,255,.2)";ctx.lineWidth=1;
    for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(center,center,r,r*Math.max(.08,Math.abs(Math.cos(angle*.25+i*.55))),i*.35,0,Math.PI*2);ctx.stroke();}
    points=NODES.map((n,i)=>{const x=r*Math.sin(n.phi)*Math.cos(n.theta+angle),y=r*Math.cos(n.phi),z=r*Math.sin(n.phi)*Math.sin(n.theta+angle);const scale=.8+(z/r+1)*.16;return {n,i,x:center+x*scale,y:center+y*scale,z,scale};}).sort((a,b)=>a.z-b.z);
    points.forEach(p=>{
      const front=(p.z/r+1)/2;ctx.save();ctx.globalAlpha=.28+front*.72;const radius=15*p.scale;
      ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle="#0d0d0f";ctx.fill();ctx.strokeStyle=colors[p.n.cat];ctx.lineWidth=p.i===index?3:1;ctx.stroke();
      if(p.i===index){ctx.beginPath();ctx.arc(p.x,p.y,radius+7,0,Math.PI*2);ctx.strokeStyle="#ff624b";ctx.lineWidth=1;ctx.stroke();}
      ctx.save();ctx.translate(p.x-9*p.scale,p.y-9*p.scale);ctx.scale(18*p.scale/24,18*p.scale/24);ctx.fillStyle=colors[p.n.cat];ctx.fill(new Path2D(p.n.icon));ctx.restore();
      if(front>.36||p.i===index){ctx.fillStyle="#f3f0e9";ctx.font="500 "+Math.max(10,12*p.scale)+"px 'Space Grotesk',sans-serif";ctx.textAlign="center";ctx.fillText(p.n.label,p.x,p.y+radius+16);}
      ctx.restore();
    });
  }
  scope.listen(canvas, "pointerdown",e=>{dragging=true;last=e.clientX;travel=0;canvas.setPointerCapture(e.pointerId);});
  scope.listen(canvas, "pointermove",e=>{if(!dragging)return;const delta=e.clientX-last;travel+=Math.abs(delta);angle+=delta*.009;last=e.clientX;draw();});
  scope.listen(canvas, "pointerup",e=>{if(!dragging)return;dragging=false;if(travel<8){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;const hit=[...points].reverse().find(p=>Math.hypot(x-p.x,y-p.y)<Math.max(24,20*p.scale));if(hit)select(hit.i);}});
  scope.listen(canvas, "pointercancel",()=>dragging=false);
  scope.listen(canvas, "pointerenter",()=>canvas.dataset.hover="true");scope.listen(canvas, "pointerleave",()=>canvas.dataset.hover="false");
  scope.listen(canvas, "focus",()=>canvas.dataset.focus="true");scope.listen(canvas, "blur",()=>canvas.dataset.focus="false");
  new scope.ResizeObserver(resize).observe(wrap);resize();
  W.loop(canvas,dt=>{if(playing&&!dragging&&canvas.dataset.hover!=="true"&&canvas.dataset.focus!=="true"){angle+=dt*.18;draw();}});
  scope.listen(document, "workshop:motion",()=>{pause.disabled=W.calm;pause.textContent=W.calm?"Calm mode · manual rotation":playing?"Pause orbit":"Resume orbit";draw();});
  if(W.calm){pause.disabled=true;pause.textContent="Calm mode · manual rotation";}
}