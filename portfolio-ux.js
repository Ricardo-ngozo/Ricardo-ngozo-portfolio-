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

  function initFloatingActions() {
    const actions = document.querySelector(".floating-actions");
    const footer = document.querySelector(".site-footer");
    if (!actions || !footer) return;
    const updatePosition = () => {
      const footerOverlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
      actions.style.setProperty("--footer-lift", footerOverlap ? `${Math.ceil(footerOverlap + 18)}px` : "0px");
    };
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    updatePosition();
  }

  function init() {
    initMobileNav();
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
