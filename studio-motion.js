/* Decorative motion never controls reading order or scrolling. */
(() => {
"use strict";
const W=window.Workshop;if(!W)return;
function init(){
const mounts=document.body.matches('[data-page="tech"]')?[["#projects","IDEAS INTO INTERFACES",false],["#why-me","BUILT TO BE PLAYED",true]]:document.body.classList.contains("personal-body")?[["#p-sparks","OFF THE CLOCK",false],[".p-footer-cta","STAY CURIOUS",true]]:document.body.classList.contains("python-log-body")?[["main.wrap","SMALL EXPERIMENTS. BIG CURIOSITY.",true]]:[];
mounts.forEach(([selector,label,blue])=>{
const target=document.querySelector(selector);if(!target)return;
const ribbon=W.el("div","studio-ribbon"+(blue?" studio-ribbon--blue":""));ribbon.setAttribute("aria-hidden","true");
const orbit=W.el("div","studio-ribbon-orbit"),track=W.el("div","studio-ribbon-track");
for(let i=0;i<6;i++)track.append(W.el("span","",label+" ↗"));
ribbon.append(orbit,track);target.before(ribbon);
W.loop(ribbon,()=>{const rect=ribbon.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top)/innerHeight));ribbon.style.setProperty("--ribbon-shift",String(progress*(innerWidth<760?45:100)));});
});
const scenes=document.querySelectorAll('section[data-chapter],.phase,.case-block,.case-content');
const active=new Set();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
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
document.addEventListener("workshop:motion",()=>{if(W.calm){active.forEach(animation=>animation.cancel());document.querySelectorAll("[style*='--edge-open']").forEach(scene=>scene.style.setProperty("--edge-open","1"));}});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();