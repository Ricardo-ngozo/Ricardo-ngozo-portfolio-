(() => {
  "use strict";
  const username = "Ricardo-ngozo";
  const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
  const email = "Ultrazen75@gmail.com";

  function initMobileNav() {
    const header = document.querySelector("[data-header]");
    const nav = document.querySelector("[data-nav]");
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!nav || !toggle) return;
    const close = () => {
      nav.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", () => {
      const opening = toggle.getAttribute("aria-expanded") !== "true";
      nav.dataset.open = String(opening);
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") { close(); toggle.focus(); }
    });
    document.addEventListener("click", event => {
      if (!header.contains(event.target)) close();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) close();
    });
  }

  function initArchive() {
    const toggle = document.querySelector("[data-archive-toggle]");
    const panel = document.getElementById("archive-panel");
    const input = document.querySelector("[data-archive-search]");
    const items = [...document.querySelectorAll(".archive-item")];
    const count = document.querySelector("[data-archive-count]");
    const empty = document.querySelector("[data-archive-empty]");
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        const opening = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(opening));
        toggle.innerHTML = opening
          ? 'Close the archive <span aria-hidden="true">−</span>'
          : 'Explore the full archive <span aria-hidden="true">＋</span>';
        panel.hidden = !opening;
        if (opening) input?.focus();
      });
    }
    if (!input || !items.length) return;
    const update = () => {
      const query = input.value.trim().toLocaleLowerCase();
      let visible = 0;
      items.forEach(item => {
        const match = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !match;
        if (match) visible++;
      });
      if (count) count.textContent = query ? `${visible} of ${items.length} projects` : `${items.length} projects`;
      if (empty) empty.hidden = visible !== 0;
    };
    input.addEventListener("input", update);
    update();
  }

  function initGameLaunch() {
    document.querySelectorAll("[data-load-game]").forEach(button => {
      button.addEventListener("click", () => {
        const frameHost = button.closest("[data-game-frame]");
        if (!frameHost || frameHost.querySelector("iframe")) return;
        const frame = document.createElement("iframe");
        frame.src = button.dataset.gameSrc;
        frame.title = "Mini Quest Runner game";
        frame.loading = "eager";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frameHost.replaceChildren(frame);
      });
    });
  }

  function initCopyEmail() {
    const button = document.querySelector("[data-copy-email]");
    const status = document.querySelector("[data-copy-status]");
    if (!button) return;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (status) status.textContent = "Email copied to clipboard.";
      } catch {
        if (status) status.textContent = `Copy this address: ${email}`;
      }
    });
  }

  function initContributions() {
    const graph = document.getElementById("contribution-graph");
    if (!graph) return;
    const totalNode = document.querySelector("[data-contribution-total]");
    const status = document.querySelector("[data-contribution-status]");
    const refresh = document.querySelector("[data-contribution-refresh]");
    const months = document.querySelector(".graph-months");
    const storageKey = "ricardo-github-contributions-v1";
    const monthFormat = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
    let busy = false;

    const paint = payload => {
      if (!Array.isArray(payload?.contributions) || !payload.contributions.length) throw new Error("No contribution days returned");
      const entries = payload.contributions
        .filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isFinite(Number(day.count)))
        .sort((a, b) => a.date.localeCompare(b.date));
      if (!entries.length) throw new Error("Contribution calendar was empty");
      const leading = new Date(entries[0].date + "T00:00:00Z").getUTCDay();
      const slots = [...Array(leading).fill(null), ...entries];
      const weeks = Math.ceil(slots.length / 7);
      while (slots.length < weeks * 7) slots.push(null);
      graph.replaceChildren();
      graph.style.setProperty("--week-count", weeks);
      graph.setAttribute("role", "img");
      graph.setAttribute("aria-label", "GitHub contribution activity for the last twelve months");
      for (const day of slots) {
        const cell = document.createElement("span");
        cell.className = "day";
        cell.style.setProperty("--day-delay", `${Math.min(graph.childElementCount * 1.5, 560)}ms`);
        cell.setAttribute("aria-hidden", "true");
        if (!day) cell.classList.add("day-spacer");
        else {
          const count = Math.max(0, Number(day.count) || 0);
          cell.dataset.level = String(Math.max(0, Math.min(4, Number(day.level) || 0)));
          const date = new Date(day.date + "T00:00:00Z");
          cell.title = `${count} contribution${count === 1 ? "" : "s"} on ${date.toLocaleDateString("en", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" })}`;
        }
        graph.append(cell);
      }
      if (months) {
        months.replaceChildren();
        months.style.setProperty("--week-count", weeks);
        let previous = "";
        for (let week = 0; week < weeks; week++) {
          const index = Math.max(0, week * 7 - leading);
          const date = new Date(entries[index].date + "T00:00:00Z");
          const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
          const label = document.createElement("span");
          if (key !== previous) {
            label.textContent = monthFormat.format(date);
            previous = key;
          }
          months.append(label);
        }
      }
      const lastYear = Number(payload.total?.lastYear);
      const thisYear = Number(payload.total?.[String(new Date().getFullYear())]);
      const total = Number.isFinite(lastYear) ? lastYear
        : Number.isFinite(thisYear) ? thisYear
        : entries.reduce((sum, day) => sum + Number(day.count || 0), 0);
      if (totalNode) totalNode.textContent = total.toLocaleString("en");
    };

    const setStatus = (message, error = false) => {
      if (status) { status.textContent = message; status.dataset.state = error ? "error" : "ready"; }
    };
    const load = async () => {
      if (busy) return;
      busy = true;
      if (refresh) { refresh.disabled = true; refresh.textContent = "Updating…"; }
      graph.setAttribute("aria-busy", "true");
      try {
        const response = await fetch(apiUrl, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`Contribution service returned ${response.status}`);
        const payload = await response.json();
        paint(payload);
        try { localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), payload })); } catch {}
        setStatus("Live public GitHub activity · upstream updates may be cached for up to one hour.");
      } catch {
        let saved;
        try { saved = JSON.parse(localStorage.getItem(storageKey) || "null"); } catch {}
        if (saved?.payload) {
          try {
            paint(saved.payload);
            const age = Math.max(1, Math.floor((Date.now() - saved.savedAt) / 86400000));
            setStatus(`Showing the last saved graph (${age} day${age === 1 ? "" : "s"} old).`, true);
          } catch { setStatus("Could not load the contribution graph. View GitHub for the latest.", true); }
        } else {
          graph.replaceChildren();
          if (totalNode) totalNode.textContent = "—";
          setStatus("Contribution data is temporarily unavailable. View GitHub for the live graph.", true);
        }
      } finally {
        busy = false;
        graph.setAttribute("aria-busy", "false");
        if (refresh) { refresh.disabled = false; refresh.textContent = "Refresh"; }
      }
    };
    refresh?.addEventListener("click", load);
    load();
  }

  function initRoleChanger() {
    const target = document.querySelector("[data-role-changer]");
    if (!target) return;
    const roles = ["Game Developer", "Full-stack Developer", "Creative Technologist", "Software Engineer"];
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % roles.length;
      target.classList.add("is-changing");
      window.setTimeout(() => {
        target.textContent = roles[index];
        target.classList.remove("is-changing");
      }, 210);
    }, 3400);
  }

  function initInteractiveAvatars() {
    document.querySelectorAll("[data-avatar-interactive]").forEach(scene => {
      const hint = scene.querySelector("[data-avatar-hint]");
      scene.addEventListener("pointermove", event => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        scene.style.setProperty("--pointer-x", ((x - 0.5) * 2).toFixed(3));
        scene.style.setProperty("--pointer-y", ((y - 0.5) * 2).toFixed(3));
        scene.classList.add("is-pointed");
      });
      scene.addEventListener("pointerleave", () => {
        scene.style.setProperty("--pointer-x", "0");
        scene.style.setProperty("--pointer-y", "0");
        scene.classList.remove("is-pointed");
      });
      scene.addEventListener("click", () => {
        const awake = scene.getAttribute("aria-pressed") !== "true";
        scene.setAttribute("aria-pressed", String(awake));
        scene.classList.toggle("is-awake", awake);
        if (hint) hint.textContent = awake ? "Orbit active · Click to settle" : "Move me · Click to interact";
      });
    });
  }

  function initLivingMotion() {
    const flightStage = document.querySelector(".hero-section, .p-hero, header.hero");
    if (flightStage) {
      flightStage.classList.add("motion-stage");
      const flock = document.createElement("div");
      flock.className = "motion-flock";
      flock.setAttribute("aria-hidden", "true");
      const bird = `<svg class="motion-bird" viewBox="0 0 54 32" focusable="false"><path class="bird-wing bird-wing-left" d="M27 17C20 7 11 4 3 7c9 2 15 7 20 15Z"/><path class="bird-wing bird-wing-right" d="M29 17C36 8 44 7 51 10c-8 1-13 5-17 12Z"/><path class="bird-body" d="M20 17c5-5 12-5 17 0l12-2-8 7-8-1-6 8-4-8-10 2Z"/></svg>`;
      [0, 1, 2].forEach((index) => {
        const wrapper = document.createElement("span");
        wrapper.className = `motion-bird-flight motion-bird-flight-${index + 1}`;
        wrapper.innerHTML = bird;
        flock.append(wrapper);
      });
      flightStage.prepend(flock);
    }

    const ending = document.querySelector(".site-footer, .p-footer-cta, footer.wrap");
    if (ending && !ending.previousElementSibling?.classList.contains("motion-runway")) {
      const runway = document.createElement("div");
      runway.className = "motion-runway";
      runway.innerHTML = `<button class="motion-runner" type="button" aria-label="Give the running dog a speed boost" aria-pressed="false"><svg class="motion-dog-svg" viewBox="0 0 156 68" aria-hidden="true"><path class="dog-tail" d="M23 29C11 24 8 15 14 11"/><path class="dog-body" d="M25 31c8-11 25-15 43-12 12 2 20 7 30 6l11-8 9 1-4 7c8 0 15-3 21 1l9 4-10 3-11-1c-5 7-17 9-30 5-17-5-31 4-46 5l-18-4Z"/><path class="dog-neck" d="M94 26c6-6 13-11 22-12 4 0 8 2 10 5l-5 5-12 5"/><path class="dog-head" d="M119 15c4-5 11-7 17-4l7 6-4 6-11 1-8-4Z"/><path class="dog-ear" d="M126 12l-2-7 7 5"/><circle class="dog-eye" cx="137" cy="17" r="1.3"/><path class="dog-collar" d="M113 18l4 11" /><g class="dog-leg dog-leg-a"><path d="M42 40l-6 13-9 6m9-6 7 4"/></g><g class="dog-leg dog-leg-b"><path d="M59 39l4 10-2 10m2-10 9 4"/></g><g class="dog-leg dog-leg-c"><path d="M89 38l-2 12-8 7m8-7 8 5"/></g><g class="dog-leg dog-leg-d"><path d="M103 36l7 11-1 10m1-10 9 4"/></g></svg></button>`;
      ending.parentNode.insertBefore(runway, ending);
      const runner = runway.querySelector(".motion-runner");
      let boostTimer;
      runner.addEventListener("click", () => {
        runner.classList.add("is-boosted");
        runner.setAttribute("aria-pressed", "true");
        runner.setAttribute("aria-label", "Running dog boosted");
        window.clearTimeout(boostTimer);
        boostTimer = window.setTimeout(() => {
          runner.classList.remove("is-boosted");
          runner.setAttribute("aria-pressed", "false");
          runner.setAttribute("aria-label", "Give the running dog a speed boost");
        }, 4000);
      });
    }

    const motionTargets = document.querySelectorAll(".phase, .jt-item");
    if ("IntersectionObserver" in window && motionTargets.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-seen");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      motionTargets.forEach((target) => {
        target.classList.add("motion-prep");
        observer.observe(target);
      });
    }
  }

  function initFloatingActions() {
    const actions = document.querySelector(".floating-actions");
    const footer = document.querySelector(".site-footer");
    if (!actions || !footer) return;
    const updatePosition = () => {
      const runway = footer.previousElementSibling?.classList.contains("motion-runway") ? footer.previousElementSibling : footer;
      const footerOverlap = Math.max(0, window.innerHeight - runway.getBoundingClientRect().top);
      actions.style.setProperty("--footer-lift", footerOverlap ? `${Math.ceil(footerOverlap + 18)}px` : "0px");
    };
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    updatePosition();
  }

  function init() {
    initMobileNav();
    initLivingMotion();
    initFloatingActions();
    initRoleChanger();
    initInteractiveAvatars();
    initArchive();
    initGameLaunch();
    initCopyEmail();
    initContributions();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
