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

  function initSectionCompanions() {
    const creatures = {
      bird: '<path d="M4 22c9-9 16-10 24-2 8-8 15-8 22-2-9-3-14 0-19 8l-5-5-5 5c-4-6-9-7-17-4Z"/><path d="M26 19C18 9 11 8 5 10c8 1 13 6 18 14Zm4 0c6-9 13-11 19-8-7 2-11 6-15 13Z" opacity=".72"/>',
      butterfly: '<path d="M30 30c-2-8-15-23-24-19-7 3 0 17 12 20-10 1-14 11-8 15 8 5 18-7 20-13Zm4 0c2-8 15-23 24-19 7 3 0 17-12 20 10 1 14 11 8 15-8 5-18-7-20-13Z"/><path d="M31 21v25m-2-25-7-7m12 7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      fox: '<path d="m9 17 5-12 10 8q6-3 12 0l10-8 5 12q4 15-10 23l-11 8-11-8Q5 32 9 17Z"/><path d="M18 27q4 4 8 0m8 0q4 4 8 0M23 37q7 5 14 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="m26 32 4 3 4-3-4-2Z"/>',
      cat: '<path d="m10 24 2-16 12 9q6-2 12 0l12-9 2 16q1 19-20 25Q9 43 10 24Z"/><path d="M18 29h1m22 0h1M25 35q5 4 10 0m-5-3v3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M10 42Q1 37 6 29" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
      bee: '<ellipse cx="31" cy="32" rx="17" ry="13"/><path d="M24 20v24m12-23v22M21 17l-5-6m26 6 5-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M22 19q-12-13-15-3-2 8 13 11m25-8q12-13 15-3 2 8-13 11" fill="none" stroke="currentColor" stroke-width="2" opacity=".72"/>',
      firefly: '<ellipse cx="31" cy="33" rx="11" ry="14"/><path d="M22 29h18m-18 8h18M25 20q-9-13-14-4-3 7 10 12m20-8q9-13 14-4 3 7-10 12M27 18l-4-7m14 7 4-7" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><circle cx="31" cy="49" r="4"/>',
      rabbit: '<ellipse cx="21" cy="17" rx="6" ry="15" transform="rotate(-12 21 17)"/><ellipse cx="40" cy="17" rx="6" ry="15" transform="rotate(12 40 17)"/><circle cx="31" cy="34" r="18"/><circle cx="25" cy="33" r="1.8"/><circle cx="37" cy="33" r="1.8"/><path d="M28 40q3 3 6 0m-3-2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      owl: '<path d="M10 20 8 8l15 7q8-4 16 0l15-7-2 12q7 23-21 29Q3 43 10 20Z"/><circle cx="23" cy="28" r="8"/><circle cx="37" cy="28" r="8"/><circle cx="23" cy="28" r="2"/><circle cx="37" cy="28" r="2"/><path d="m27 37 4 5 4-5Z"/>',
      dog: '<path d="M10 20q4-12 17-10l8 5q9-5 17 2l-4 9q-2 15-17 20Q13 42 10 29Z"/><path d="M13 17Q4 6 7 26m38-11q11-10 10 8M22 28h1m17 0h1m-12 8q4 3 8 0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
      turtle: '<ellipse cx="32" cy="34" rx="20" ry="15"/><path d="M16 34q16-16 32 0-16 17-32 0Zm-8-8-7-5m45 4 8-5M13 43l-5 7m38-7 5 7M48 30q13-5 14 4-1 7-13 5" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><circle cx="55" cy="32" r="1.4"/>',
      ball: '<circle cx="32" cy="32" r="23"/><path d="M12 20q13 1 18 12-7 10-4 22M50 13q-2 13-18 19 10 9 17 25M11 43q10-10 21-11 9-13 17-17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
      arrow: '<path d="M12 49 49 12M19 12h30v30" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="50" r="5"/>',
      star: '<path d="m32 5 7 18 19 1-15 12 5 19-16-11-16 11 5-19L6 24l19-1Z"/><circle cx="32" cy="32" r="5" fill="#efbd73"/>',
      rocket: '<path d="M36 8Q53 9 54 26L36 44 20 28Q20 11 36 8Z"/><path d="m21 28-9 3-4 12 14-3m14 4-3 10 12-4 3-10M28 36l-9 9m16-32 8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="23" r="4"/>',
      shield: '<path d="M32 6 53 14v16q-2 19-21 28Q13 49 11 30V14Z"/><path d="m21 32 7 7 15-16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
      firework: '<path d="M31 27 33 5l5 20 16-15-12 18 20 3-21 3 13 17-17-13-5 22-3-22-18 12 13-17L4 31l21-3L13 9l17 16Z"/><circle cx="32" cy="31" r="5" fill="#efbd73"/>'
    };
    const byId = {
      home:"bird", stack:"butterfly", projects:"fox", archive:"cat", contributions:"firefly",
      journey:"rabbit", certifications:"bee", "why-me":"owl", contact:"firefly",
      "p-hero":"bird", "p-origin":"fox", "p-sparks":"cat", "p-building":"dog",
      "p-beyond":"butterfly", "p-footer-cta":"firefly"
    };
    const phases = ["turtle","ball","bee","arrow","star","rocket","shield","bird","firework"];
    const sections = document.querySelectorAll("section[id], .p-footer-cta, .phase, header.hero");
    sections.forEach((section, index) => {
      if (section.querySelector(":scope > .section-companion")) return;
      let kind = byId[section.id];
      if (section.classList.contains("phase")) {
        const number = Number(section.querySelector(".num")?.textContent.trim()) || 1;
        kind = phases[(number - 1) % phases.length];
      }
      if (section.matches("header.hero")) kind = "turtle";
      if (section.classList.contains("p-footer-cta")) kind = "firefly";
      kind ||= ["bee","firefly","butterfly","fox"][index % 4];
      section.classList.add("has-companion");
      const button = document.createElement("button");
      button.type = "button";
      button.className = `section-companion section-companion--${kind} ${index % 2 ? "companion-left" : ""}`;
      button.setAttribute("aria-label", `Let the ${kind} interact with this section`);
      button.title = `Let the ${kind} interact with this section`;
      button.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${creatures[kind]}</svg><span class="companion-spark" aria-hidden="true"></span>`;
      const target = section.querySelector(".fw-card, .archive-item, .contribution-wrapper, .jt-card, .cert-tile, .wb-card, .contact-form, .phase-body, .p-mosaic-item, .hero-canvas-box, .tech-globe-wrap, h1, h2") || section;
      const wake = () => {
        button.classList.add("is-awake");
        target.classList.add("companion-reacted");
      };
      const settle = () => {
        button.classList.remove("is-awake");
        target.classList.remove("companion-reacted");
      };
      button.addEventListener("pointerenter", wake);
      button.addEventListener("pointerleave", settle);
      button.addEventListener("focus", wake);
      button.addEventListener("blur", settle);
      button.addEventListener("click", () => {
        wake();
        window.setTimeout(settle, 1150);
      });
      section.append(button);
    });
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
    initSectionCompanions();
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
