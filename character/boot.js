const mounts = new Map();
const scriptURL = import.meta.url;
const assetURL = new URL("../assets/character/ricardo-v2.glb", scriptURL).href;
const moduleURL = new URL("../assets/character/viewer.js", scriptURL).href;
const preference = matchMedia("(prefers-reduced-motion: reduce)");
const isCalm = () => preference.matches || Boolean(window.Workshop?.calm);
let suspended = false;
const emitReaction = (emotion, source) => document.dispatchEvent(new CustomEvent("character:reaction", {detail:{emotion,source}}));

function mount(host) {
  if (mounts.has(host)) return;
  const abort = new AbortController(), {signal} = abort;
  const stage = host.querySelector(".character-stage");
  const hint = host.querySelector("[data-character-hint]");
  const status = host.querySelector("[data-character-status]");
  const state = {abort, controller:null, started:false, disposed:false, emotion:"neutral",portrait:false, observer:null};
  mounts.set(host,state);
  function update(data) {
    if(state.disposed)return;
    if(data.status) {
      host.dataset.characterState=data.status;
      if(data.status==="ready"){hint.textContent="Drag to turn · tap to say hello";status.textContent="Ricardo is ready.";}
      if(data.status==="fallback"){hint.textContent="Ricardo · still portrait";status.textContent="3D is unavailable. The portrait remains visible.";}
    }
    if(data.emotion){host.dataset.characterEmotion=data.emotion;state.emotion=data.emotion;
      host.querySelectorAll("[data-emotion]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.emotion===data.emotion)));
    }
    if(data.action)host.dataset.characterAction=data.action;
  }
  async function start() {
    if(state.started||state.disposed)return;state.started=true;host.dataset.characterState="loading";
    try {
      const {createCharacter}=await import(moduleURL);
      if(signal.aborted)return;
      state.controller=await createCharacter(stage,{signal,assetURL,calm:isCalm(),onState:update});
      if(signal.aborted){state.controller.dispose();return;}
      host.character=state.controller;
      state.controller.setEmotion(state.emotion,Infinity);
    } catch(error) { if(error.name!=="AbortError")update({status:"fallback"}); }
  }
  state.observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){state.observer.disconnect();start();}},{rootMargin:"150px"});
  state.observer.observe(host);
  const reaction=(emotion,source,seconds=4)=>{state.emotion=emotion;state.controller?.setEmotion(emotion,seconds);emitReaction(emotion,source);};
  document.addEventListener("pointermove",event=>{
    if(event.pointerType==="touch"||isCalm()||!state.controller)return;
    const r=stage.getBoundingClientRect();
    state.controller.lookAt((event.clientX-(r.left+r.width/2))/Math.max(innerWidth/2,1),(r.top+r.height*.28-event.clientY)/Math.max(innerHeight/2,1));
  },{passive:true,signal});
  document.addEventListener("pointerleave",()=>state.controller?.lookAt(0,0),{signal});
  host.querySelector("[data-wave]").addEventListener("click",()=>{start();state.controller?.wave();reaction("happy","wave");status.textContent="Ricardo says hello.";},{signal});
  host.querySelector("[data-portrait]").addEventListener("click",e=>{state.portrait=!state.portrait;state.controller?.setPortrait(state.portrait);e.currentTarget.setAttribute("aria-pressed",String(state.portrait));e.currentTarget.textContent=state.portrait?"Full character":"Portrait view";},{signal});
  host.querySelectorAll("[data-emotion]").forEach(button=>button.addEventListener("click",()=>{reaction(button.dataset.emotion,"expression",Infinity);status.textContent="Expression: "+button.dataset.emotion;},{signal}));
  let clicks=0,yaw=-.13,origin=null,dragged=false;
  stage.addEventListener("pointerdown",e=>{origin={x:e.clientX,y:e.clientY,yaw};dragged=false;},{signal});
  stage.addEventListener("pointermove",e=>{
    if(!origin)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;
    if(!dragged&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)){dragged=true;stage.setPointerCapture(e.pointerId);}
    if(dragged){yaw=Math.max(-1.3,Math.min(1.3,origin.yaw+dx*.009));state.controller?.setYaw(yaw);}
  },{signal});
  stage.addEventListener("pointerup",()=>{origin=null;},{signal});stage.addEventListener("pointercancel",()=>{origin=null;dragged=true;},{signal});
  function clickReaction(){if(dragged){dragged=false;return;}start();const emotions=["happy","curious","surprised","annoyed"];reaction(emotions[clicks++%emotions.length],"click");status.textContent="Ricardo looks "+state.emotion+".";if(clicks===1)state.controller?.wave();}
  stage.addEventListener("click",clickReaction,{signal});
  stage.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){e.preventDefault();clickReaction();}
    if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();yaw=Math.max(-1.3,Math.min(1.3,yaw+(e.key==="ArrowLeft"?-.15:.15)));state.controller?.setYaw(yaw);}
    if(e.key==="Home"){e.preventDefault();yaw=-.13;state.controller?.setYaw(yaw);}
  },{signal});
  for(const card of document.querySelectorAll(".fw-card,.archive-item")){
    const react=()=>reaction("curious","project");
    card.addEventListener("pointerenter",react,{signal});card.addEventListener("focusin",react,{signal});
    card.addEventListener("pointerleave",()=>reaction("neutral","project"),{signal});
    card.addEventListener("focusout",event=>{if(!card.contains(event.relatedTarget))reaction("neutral","project");},{signal});
  }
  document.addEventListener("portfolio:contact",event=>{
    const moods={success:"happy",invalid:"surprised",error:"annoyed",pending:"curious"};
    reaction(moods[event.detail.status]||"neutral","contact",8);
  },{signal});
  const motion=()=>state.controller?.setCalm(isCalm());
  document.addEventListener("workshop:motion",motion,{signal});preference.addEventListener("change",motion,{signal});
  state.dispose=()=>{if(state.disposed)return;state.disposed=true;state.observer.disconnect();abort.abort();state.controller?.dispose();delete host.character;host.dataset.characterState="poster";mounts.delete(host);};
}
function init(){if(suspended)return;document.querySelectorAll("[data-character]").forEach(mount);}
document.addEventListener("DOMContentLoaded",init,{once:true});if(document.readyState!=="loading")init();
window.addEventListener("pagehide",()=>{suspended=true;[...mounts.values()].forEach(s=>s.dispose());});
window.addEventListener("pageshow",()=>{suspended=false;init();});
const removalObserver=new MutationObserver(()=>{for(const [host,state]of mounts)if(!host.isConnected)state.dispose();});
removalObserver.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("pagehide",()=>removalObserver.disconnect());
window.addEventListener("pageshow",()=>removalObserver.observe(document.documentElement,{childList:true,subtree:true}));
