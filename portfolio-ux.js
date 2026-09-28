(() => {
  "use strict";
  const username = "Ricardo-ngozo";
  const profileUrl = `https://github.com/${username}`;
  const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;

  const initContributions = () => {
    const graph = document.getElementById("contribution-graph");
    if (!graph) return;
    const totalNode = document.querySelector("[data-contribution-total]");
    const status = document.querySelector("[data-contribution-status]");
    const refresh = document.querySelector("[data-contribution-refresh]");
    const months = document.querySelector(".graph-months");
    const storageKey = "ricardo-github-contributions-v1";
    const formatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
    let busy = false;

    const paint = (payload) => {
      if (!Array.isArray(payload?.contributions) || !payload.contributions.length) throw new Error("No contribution days returned");
      const entries = payload.contributions.filter(item => /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(Number(item.count)));
      if (!entries.length) throw new Error("Contribution calendar was empty");
      const first = new Date(entries[0].date + "T00:00:00Z");
      const leading = first.getUTCDay();
      const slots = [...Array(leading).fill(null), ...entries];
      const weeks = Math.ceil(slots.length / 7);
      while (slots.length < weeks * 7) slots.push(null);
      graph.replaceChildren();
      graph.style.setProperty("--week-count", weeks);
      graph.setAttribute("role", "img");
      graph.setAttribute("aria-label", "GitHub contributions by day over the last twelve months");
      slots.forEach((item) => {
        const cell = document.createElement("span");
        cell.className = "day";
        cell.setAttribute("aria-hidden", "true");
        if (item) {
          const count = Math.max(0, Number(item.count) || 0);
          const level = Math.max(0, Math.min(4, Number(item.level) || 0));
          cell.dataset.level = String(level);
          cell.title = `${count} contribution${count === 1 ? "" : "s"} on ${new Date(item.date + "T00:00:00Z").toLocaleDateString("en", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" })}`;
        } else {
          cell.classList.add("day-spacer");
        }
        graph.append(cell);
      });
      if (months) {
        months.replaceChildren();
        months.style.setProperty("--week-count", weeks);
        let previousMonth = "";
        for (let week = 0; week < weeks; week++) {
          const dayIndex = week * 7 - leading;
          const item = entries[Math.max(0, dayIndex)];
          const date = item ? new Date(item.date + "T00:00:00Z") : null;
          const monthKey = date ? `${date.getUTCFullYear()}-${date.getUTCMonth()}` : "";
          const label = document.createElement("span");
          if (monthKey && monthKey !== previousMonth) {
            label.textContent = formatter.format(date);
            previousMonth = monthKey;
          }
          months.append(label);
        }
      }
      const reported = Number(payload.total?.lastYear);
      const yearTotal = Number(payload.total?.[String(new Date().getFullYear())]);
      const total = Number.isFinite(reported) ? reported : (Number.isFinite(yearTotal) ? yearTotal : entries.reduce((sum, item) => sum + Number(item.count || 0), 0));
      if (totalNode) totalNode.textContent = total.toLocaleString("en");
    };

    const showStatus = (text, error = false) => {
      if (!status) return;
      status.textContent = text;
      status.dataset.state = error ? "error" : "ready";
    };
    const setBusy = (value) => {
      busy = value;
      if (refresh) {
        refresh.disabled = value;
        refresh.textContent = value ? "Updating…" : "Refresh";
      }
      graph.setAttribute("aria-busy", String(value));
    };
    const load = async () => {
      if (busy) return;
      setBusy(true);
      try {
        const response = await fetch(apiUrl, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`Contribution service returned ${response.status}`);
        const payload = await response.json();
        paint(payload);
        try { localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), payload })); } catch {}
        showStatus("Live public contribution data · may be cached for up to an hour.");
      } catch {
        let cached;
        try { cached = JSON.parse(localStorage.getItem(storageKey) || "null"); } catch {}
        if (cached?.payload) {
          try {
            paint(cached.payload);
            const age = Math.max(1, Math.floor((Date.now() - cached.savedAt) / 86400000));
            showStatus(`Showing the last saved graph (${age} day${age === 1 ? "" : "s"} old). Connect to GitHub for the latest.`, true);
          } catch { showStatus("Could not load contribution data. View the live graph on GitHub.", true); }
        } else {
          graph.replaceChildren();
          if (totalNode) totalNode.textContent = "—";
          showStatus("Could not load contribution data right now. View the live graph on GitHub.", true);
        }
      } finally { setBusy(false); }
    };
    if (refresh) refresh.addEventListener("click", load);
    load();
  };

  const initArchiveSearch = () => {
    const input = document.querySelector("[data-archive-search]");
    const items = [...document.querySelectorAll(".archive-item")];
    const count = document.querySelector("[data-archive-count]");
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
    };
    input.addEventListener("input", update);
    update();
  };
  document.addEventListener("DOMContentLoaded", () => { initContributions(); initArchiveSearch(); });
  if (document.readyState !== "loading") { initContributions(); initArchiveSearch(); }
})();
