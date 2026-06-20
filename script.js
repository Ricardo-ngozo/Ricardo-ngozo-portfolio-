const body = document.body;
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const header = document.querySelector("[data-header]");
const canvas = document.querySelector(".ambient-canvas");
const ctx = canvas?.getContext("2d");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
}

const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const sections = sectionLinks
  .map((link) => {
    const id = link.getAttribute("href")?.split("#")[1];
    return id ? document.getElementById(id) : null;
  })
  .filter(Boolean);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  revealObserver.observe(element);
});

function updateActiveNav() {
  const scrollPoint = window.scrollY + window.innerHeight * 0.28;
  let current = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPoint) current = section.id;
  });

  sectionLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href")?.endsWith(`#${current}`));
  });

  header?.classList.toggle("scrolled", window.scrollY > 20);
}

function updateProgressLines() {
  document.querySelectorAll("[data-progress-line]").forEach((line) => {
    const rect = line.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    const visible = window.innerHeight - rect.top;
    const progress = Math.max(0.12, Math.min(1, visible / total));
    line.style.setProperty("--line-progress", progress.toFixed(3));
  });
}

window.addEventListener("scroll", () => {
  updateActiveNav();
  updateProgressLines();
});

window.addEventListener("resize", updateProgressLines);
updateActiveNav();
updateProgressLines();

if (ctx && canvas) {
  let width = 0;
  let height = 0;
  let particles = [];
  let pointer = { x: 0.5, y: 0.5 };

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(110, Math.floor((width * height) / 11000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(3, 6, 11, 0.24)";
    ctx.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx + (pointer.x - 0.5) * 0.06;
      particle.y += particle.vy + (pointer.y - 0.5) * 0.06;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 120) {
          ctx.strokeStyle = `rgba(100, 239, 255, ${0.14 - distance / 950})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.fillStyle = "rgba(247, 251, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawNetwork);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer = {
      x: event.clientX / Math.max(width, 1),
      y: event.clientY / Math.max(height, 1),
    };
  });

  resizeCanvas();
  drawNetwork();
}
