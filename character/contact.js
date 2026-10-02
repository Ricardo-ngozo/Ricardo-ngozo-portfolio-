/* Progressive enhancement: the form keeps its original action/method without JS. */
(() => {
  const form=document.querySelector(".contact-form");if(!form)return;
  const button=form.querySelector('[type="submit"]');
  const feedback=document.createElement("p");feedback.className="contact-feedback";feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");form.append(feedback);
  let pending=null;const originalLabel=button.innerHTML;
  const report=(status,text)=>{feedback.textContent=text;form.dataset.submitState=status;document.dispatchEvent(new CustomEvent("portfolio:contact",{detail:{status}}));};
  form.addEventListener("invalid",()=>report("invalid","Please complete the required fields and check your email address."),true);
  form.addEventListener("input",()=>{if(form.dataset.submitState==="invalid"){feedback.textContent="";delete form.dataset.submitState;}});
  form.addEventListener("submit",async event=>{
    if(!window.fetch||!window.FormData)return;
    event.preventDefault();if(pending)return;
    if(!form.reportValidity())return;
    pending=new AbortController();const controller=pending;
    const timer=setTimeout(()=>controller.abort(),20000);
    button.disabled=true;button.textContent="Sending…";form.setAttribute("aria-busy","true");report("pending","Sending your message…");
    try{
      const response=await fetch(form.action,{method:form.method.toUpperCase(),body:new FormData(form),headers:{Accept:"application/json"},signal:controller.signal});
      if(!response.ok)throw new Error("The service could not accept the message.");
      report("success","Thanks — your message was sent. I’ll get back to you soon.");form.reset();
    }catch(error){
      report("error",error.name==="AbortError"?"Sending timed out. Your message is still here; please try again or use the email link.":"Your message could not be sent. It is still here; please try again or use the email link.");
    }finally{clearTimeout(timer);pending=null;button.disabled=false;button.innerHTML=originalLabel;form.removeAttribute("aria-busy");}
  });
  window.addEventListener("pagehide",()=>pending?.abort());
})();
