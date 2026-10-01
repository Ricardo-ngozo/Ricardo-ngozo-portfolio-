(() => {
  "use strict";
  const W=window.Workshop;if(!W)return;
  const el=W.el;
  const projectCards=[...document.querySelectorAll(".fw-card,.archive-item")];
  const slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const entries=projectCards.map(card=>{
    const title=card.querySelector("h3").textContent.trim(),links=[...card.querySelectorAll("a[href]")];
    const url=links.find(a=>a.href.includes("case-study"))?.href;
    const text=card.textContent;
    const category=/game|tic-tac/i.test(title)?"Games":/airbnb/i.test(title)?"Fullstack":/quiz|task|todo|to-do/i.test(title)?"Experiments":"Interfaces";
    const status=/in progress/i.test(text)?"In progress":/group|prototype|quiz/i.test(text)?"Collaboration":category==="Experiments"?"Experiment":"Portfolio build";
    return {card,title,id:slug(title),url,links,category,status,summary:card.querySelector("p")?.textContent||"",image:card.querySelector("img"),tags:[...card.querySelectorAll(".fw-card-tech span")].map(e=>e.textContent)};
  });
  W.projects=entries;
  function safeLink(href,label,cls="workshop-button"){const a=el("a",cls,label);a.href=href;if(new URL(href,location.href).origin!==location.origin){a.target="_blank";a.rel="noopener noreferrer";}return a;}
  async function openProject(item,historyMode="push"){
    if(document.querySelector(".project-dialog"))return;
    const oldUrl=new URL(location.href),url=new URL(location.href);url.searchParams.set("project",item.id);
    if(historyMode==="push")history.pushState({workshopProject:item.id},"",url);
    const d=W.dialog(item.title);d.dialog.classList.add("project-dialog");
    d.content.append(el("p","project-status",item.category+" / "+item.status),el("p","project-summary",item.summary));
    const actions=el("div","workshop-actions");
    [...new Map(item.links.filter(a=>!a.classList.contains("project-preview")).map(a=>[a.href,a])).values()].forEach(a=>actions.append(safeLink(a.href,a.textContent.trim()||"GitHub")));
    const share=el("button","workshop-button","Copy project link");share.type="button";share.addEventListener("click",()=>W.copy(url.href,share));actions.append(share);d.content.append(actions);
    const gallery=el("div","project-gallery"),img=el("img"),caption=el("p","gallery-caption");
    const slides=[];if(item.image)slides.push({src:item.image.src,alt:item.image.alt||item.title,caption:"Project screenshot"});
    let index=0;
    const stage=el("div","gallery-stage");stage.append(img);gallery.append(stage,caption);
    const nav=el("div","workshop-actions"),previous=el("button","workshop-button","Previous image"),next=el("button","workshop-button","Next image");
    previous.type=next.type="button";
    const render=()=>{gallery.hidden=!slides.length;if(!slides.length)return;const s=slides[index];img.src=s.src;img.alt=s.alt;caption.textContent=(index+1)+" / "+slides.length+" · "+s.caption;previous.disabled=next.disabled=slides.length<2;};
    previous.addEventListener("click",()=>{index=(index+slides.length-1)%slides.length;render();});next.addEventListener("click",()=>{index=(index+1)%slides.length;render();});nav.append(previous,next);gallery.append(nav);d.content.append(gallery);render();
    const notes=el("div","preview-notes");d.content.append(notes);
    if(!slides.length)notes.append(el("p","experience-note","Screenshots have not been added for this project yet."));
    d.dialog.addEventListener("close",()=>{
      if(new URL(location.href).searchParams.get("project")===item.id){
        const clean=new URL(location.href);clean.searchParams.delete("project");history.replaceState(null,"",clean);
      }
    });
    d.show();W.tone(540);
    if(item.url){
      notes.append(el("p","","Loading build notes…"));
      const controller=new AbortController();
      d.dialog.addEventListener("close",()=>controller.abort(),{once:true});
      try{
        const response=await fetch(item.url,{signal:controller.signal});if(!response.ok)throw Error();
        const doc=new DOMParser().parseFromString(await response.text(),"text/html");
        if(!d.dialog.isConnected)return;
        notes.replaceChildren();
        const archiveSlug=new URL(item.url).searchParams.get("project");
        const data=window.ARCHIVE_NOTES?.[archiveSlug];
        const blocks=data?[["The brief",data.brief],["How it was built",data.approach],["What I learned",data.learning]]:
          [...doc.querySelectorAll(".case-block")].map(block=>[block.querySelector("h2,h3")?.textContent||"Build notes",[...block.querySelectorAll("p,li")].map(e=>e.textContent).join("\n\n")]);
        blocks.forEach(([heading,copy])=>{const section=el("section","preview-note");section.append(el("h3","",heading),el("p","",copy));notes.append(section);});
        doc.querySelectorAll(".case-study-hero-visual img,.case-study-visuals img").forEach(image=>{
          const src=new URL(image.getAttribute("src"),item.url).href;
          if(!slides.some(s=>s.src===src))slides.push({src,alt:image.alt,caption:image.closest("figure")?.querySelector("figcaption")?.textContent||image.alt||"Project detail"});
        });render();
        if(!blocks.length)notes.append(safeLink(item.url,"Read the complete case study"));
      }catch(e){if(e.name!=="AbortError"){notes.replaceChildren(el("p","","Build notes could not load here."),safeLink(item.url,"Open the case study"));}}
    }
    
    
  }
  function homeProjects(){
    if(!entries.length)return;
    const toolbar=el("div","project-toolbar"),filters=el("div","project-filters"),search=el("input","project-search");
    search.type="search";search.placeholder="Find a project or technology";search.setAttribute("aria-label","Search projects and technology");
    const status=el("p","project-results");status.setAttribute("role","status");let category="All";
    ["All","Games","Interfaces","Fullstack","Experiments"].forEach(name=>{const b=el("button","workshop-button",name);b.type="button";b.setAttribute("aria-pressed",String(name==="All"));b.addEventListener("click",()=>{category=name;filters.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));filter();});filters.append(b);});
    toolbar.append(filters,search,status);document.querySelector(".fw-grid").before(toolbar);
    entries.forEach(item=>{
      const button=el("button","workshop-button project-preview","Quick look");button.type="button";button.setAttribute("aria-label","Preview "+item.title);
      button.addEventListener("click",()=>openProject(item));
      item.card.querySelector(".fw-card-links,.archive-actions")?.append(button);
      const badge=el("span","project-status",item.status);item.card.querySelector(".fw-card-top,.archive-meta")?.append(badge);
    });
    function filter(){
      const query=search.value.trim().toLowerCase();let selected=0,archive=0;
      entries.forEach(item=>{const show=(category==="All"||item.category===category)&&(!query||(item.title+" "+item.summary+" "+item.card.textContent).toLowerCase().includes(query));item.card.hidden=!show;if(show){if(item.card.matches(".fw-card"))selected++;else archive++;}});
      status.textContent=selected+" selected projects · "+archive+" in the archive";
      const panel=document.getElementById("archive-panel"),toggle=document.querySelector("[data-archive-toggle]");
      if(category!=="All"||query){if(panel)panel.hidden=false;if(toggle)toggle.setAttribute("aria-expanded","true");}
      const empty=document.querySelector("[data-archive-empty]");if(empty)empty.hidden=archive>0;
      const count=document.querySelector("[data-archive-count]");if(count)count.textContent=archive+" projects";
    }
    search.addEventListener("input",filter);filter();
    const archiveSearch=document.querySelector("[data-archive-search]");
    archiveSearch?.addEventListener("input",()=>{search.value=archiveSearch.value;filter();});
    document.addEventListener("workshop:technology",e=>{search.value=e.detail.search||e.detail.label;category="All";filters.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.textContent==="All")));filter();});
    const deepLink=()=>{const id=new URL(location.href).searchParams.get("project");const item=entries.find(e=>e.id===id);if(item)openProject(item,"replace");else document.querySelector(".project-dialog")?.close();};
    window.addEventListener("popstate",deepLink);deepLink();
    const current=el("aside","currently-building");current.append(el("p","section-kicker","ON THE WORKBENCH"),el("h3","","An interactive portfolio, built in public."),el("p","","Exploring how useful interfaces, playable experiments, and a little personality fit together."));
    const date=el("time","experience-note","Updated 1 October 2026");date.dateTime="2026-10-01";
    const row=el("div","workshop-actions");row.append(safeLink("https://github.com/Ricardo-ngozo/Ricardo-ngozo-portfolio-","Follow the build"),safeLink("./python-learning-log.html","Visit the lab"));
    current.append(date,row);document.querySelector("#journey .journey-timeline")?.after(current);
  }
  function caseStudies(){
    const hero=document.querySelector(".case-study-hero-copy");if(!hero)return;
    const summary=el("aside","case-at-a-glance");summary.append(el("p","section-kicker","AT A GLANCE"));
    const tags=hero.querySelector(".case-study-tags");if(tags)summary.append(tags.cloneNode(true));
    const source=hero.querySelector('a[href*="github.com"]');
    summary.append(el("p","","Explore the brief, design decisions, tools, and lessons below."));
    if(source)summary.append(safeLink(source.href,"Inspect the source"));
    const share=el("button","workshop-button","Copy case-study link");share.type="button";share.addEventListener("click",()=>W.copy(location.href,share));summary.append(share);hero.append(summary);
    const chapters=[...document.querySelectorAll(".case-block")],nav=el("nav","case-contents");nav.setAttribute("aria-label","Case study contents");
    chapters.forEach((block,i)=>{block.id="note-"+(i+1);const heading=block.querySelector("h2");if(heading)nav.append(safeLink("#"+block.id,String(i+1).padStart(2,"0")+" · "+heading.textContent));});
    document.querySelector(".case-study-details")?.before(nav);
    document.querySelectorAll(".case-study-hero-visual img,.case-study-visuals img").forEach(image=>{
      const b=el("button","image-zoom");b.type="button";b.setAttribute("aria-label","Enlarge "+image.alt);image.before(b);b.append(image);
      b.addEventListener("click",()=>{const d=W.dialog(image.alt||"Project image");const full=image.cloneNode();full.className="lightbox-image";d.content.append(full);d.show();});
    });
  }
  function personal(){
    const origin=document.querySelector("#p-origin");if(!origin)return;
    const source=[...origin.querySelectorAll(".p-origin-images img")];
    const memories=[
      ["The spark","Technology became something to look closely at: devices, interfaces, and the details that make them work.",source[0]],
      ["The curiosity","From using technology to wondering what happens behind every pixel.",source[1]],
      ["The first builds","2026: curiosity became regular practice, projects, and a direction toward fullstack and game development.",source[2]]
    ];
    const timeline=el("div","memory-timeline"),buttons=el("div","memory-tabs"),display=el("article","memory-detail");
    buttons.setAttribute("role","tablist");buttons.setAttribute("aria-label","The story so far");
    memories.forEach(([title,copy,image],i)=>{
      const b=el("button","workshop-button",String(i+1).padStart(2,"0")+" · "+title);b.type="button";b.id="memory-tab-"+i;b.setAttribute("role","tab");b.setAttribute("aria-controls","memory-panel");
      const show=()=>{buttons.querySelectorAll("button").forEach((x,j)=>{x.setAttribute("aria-selected",String(i===j));x.tabIndex=i===j?0:-1;});display.replaceChildren();display.setAttribute("aria-labelledby",b.id);if(image){const photo=image.cloneNode();photo.alt=image.alt;display.append(photo);}const text=el("div");text.append(el("h3","",title),el("p","",copy));display.append(text);};
      b.addEventListener("click",show);b.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();const next=e.key==="Home"?0:e.key==="End"?2:(i+(e.key==="ArrowRight"?1:2))%3;buttons.children[next].click();buttons.children[next].focus();}});
      buttons.append(b);if(i===0)queueMicrotask(show);
    });
    display.id="memory-panel";display.setAttribute("role","tabpanel");timeline.append(buttons,display);origin.append(timeline);
    document.querySelectorAll(".p-spark-card").forEach((card,i)=>{
      const copy=card.querySelector(".p-spark-info p");if(!copy)return;copy.id="influence-"+i;
      const button=el("button","influence-toggle","Why it matters");button.type="button";button.setAttribute("aria-expanded","false");button.setAttribute("aria-controls",copy.id);
      button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")!=="true";button.setAttribute("aria-expanded",String(open));card.classList.toggle("influence-open",open);button.textContent=open?"Close note":"Why it matters";W.tone(520);});
      card.querySelector(".p-spark-info").append(button);
    });
    document.querySelectorAll(".p-mosaic-item").forEach(card=>{
      const b=el("button","memory-open","Take a closer look");b.type="button";b.addEventListener("click",()=>{const d=W.dialog(card.querySelector("h3").textContent);const image=card.querySelector("img").cloneNode();image.className="lightbox-image";d.content.append(image,el("p","",card.querySelector(".p-mosaic-label span").textContent+" · From Ricardo’s personal collection."));d.show();});card.querySelector(".p-mosaic-label").append(b);
    });
  }
  homeProjects();caseStudies();personal();
})();
