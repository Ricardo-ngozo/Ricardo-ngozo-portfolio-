/* Decorative motion never controls reading order or scrolling. */
export function initStudioMotion(scope) {
"use strict";
const W=scope.workshop();if(!W)return;
function init(){
if(matchMedia('(max-width: 820px)').matches)return;
const scenes=document.querySelectorAll('section[data-chapter],.phase,.case-block,.case-content');
const active=new Set();scope.defer(()=>active.forEach(animation=>animation.cancel()));
const observer=new scope.IntersectionObserver(entries=>entries.forEach(entry=>{
if(!entry.isIntersecting)return;
observer.unobserve(entry.target);
if(W.calm||!entry.target.animate)return;
const heading=entry.target.querySelector("h2,h3");
if(!heading)return;
const animation=heading.animate([{opacity:.55,clipPath:"inset(0 0 55% 0)",translate:"0 24px"},{opacity:1,clipPath:"inset(0 0 0 0)",translate:"0 0"}],{duration:850,easing:"cubic-bezier(.16,1,.3,1)"});
active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
}),{threshold:0,rootMargin:"0px 0px -10% 0px"});
scenes.forEach(scene=>observer.observe(scene));
document.querySelectorAll("#projects,#p-origin,#p-beyond").forEach(scene=>W.loop(scene,()=>{const rect=scene.getBoundingClientRect();const open=Math.max(.15,Math.min(1,(innerHeight-rect.top)/(innerHeight*.65)));scene.style.setProperty("--edge-open",String(open));}));
scope.listen(document, "workshop:motion",()=>{if(W.calm){active.forEach(animation=>animation.cancel());document.querySelectorAll("[style*='--edge-open']").forEach(scene=>scene.style.setProperty("--edge-open","1"));}});
}
init();
}
