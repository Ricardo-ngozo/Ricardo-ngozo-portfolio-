document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cursor = document.createElement("div");
  const dot = document.createElement("div");
  const label = document.createElement("span");
  cursor.className = "custom-cursor";
  dot.className = "custom-cursor-dot";
  label.className = "custom-cursor-label";
  cursor.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  label.setAttribute("aria-hidden", "true");
  cursor.appendChild(label);
  document.body.append(cursor, dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let hasMoved = false;
  let cursorScale = 1;
  let targetScale = 1;

  const interactiveSelector = "a, button, input, textarea, select, [role='button'], [data-cursor='button']";
  const mediaSelector = "[data-tilt], .project-visual, .archive-card, .memory-card, .featured-project-card, .tic-board button";
  const textSelector = "p, h1, h2, h3, h4, input, textarea, .case-content, .hero-tagline, .museum-hero-copy";

  const getLabel = (target) => {
    const labelled = target.closest("[data-cursor-label]");
    if (labelled) return labelled.dataset.cursorLabel;
    if (target.closest(".tic-board button")) return "Play";
    if (target.closest(".project-visual, .featured-project-card")) return "View";
    if (target.closest(".archive-card")) return "Open";
    if (target.closest(".memory-card")) return "Explore";
    return "";
  };

  const setStateFromTarget = (target) => {
    const interactive = target.closest(interactiveSelector);
    const media = target.closest(mediaSelector);
    const text = target.closest(textSelector);
    const cursorLabel = getLabel(target);

    document.body.classList.toggle("cursor-hover", Boolean(interactive));
    document.body.classList.toggle("cursor-media", Boolean(media));
    document.body.classList.toggle("cursor-text", Boolean(text) && !interactive && !media);
    document.body.classList.toggle("cursor-label", Boolean(cursorLabel));
    label.textContent = cursorLabel;
    targetScale = cursorLabel ? 1.15 : 1;
  };

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursorScale += (targetScale - cursorScale) * 0.18;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${cursorScale})`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    requestAnimationFrame(animateCursor);
  };

  window.addEventListener("mousemove", (event) => {
    if (!hasMoved) {
      hasMoved = true;
      document.body.classList.add("cursor-ready");
    }
    mouseX = event.clientX;
    mouseY = event.clientY;
    setStateFromTarget(event.target);
  });

  window.addEventListener("mousedown", () => document.body.classList.add("cursor-down"));
  window.addEventListener("mouseup", () => document.body.classList.remove("cursor-down"));
  window.addEventListener("mouseleave", () => document.body.classList.add("cursor-hidden"));
  window.addEventListener("mouseenter", () => document.body.classList.remove("cursor-hidden"));

  animateCursor();
});
