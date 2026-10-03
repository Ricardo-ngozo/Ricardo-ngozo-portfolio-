export function mountWorkshop(scope) {

    "use strict";
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const read = (key, fallback, storage) => { try { return JSON.parse((storage === "session" ? window.sessionStorage : window.localStorage).getItem(key)) ?? fallback; } catch { return fallback; } };
    const save = (key, value, storage) => { try { (storage === "session" ? window.sessionStorage : window.localStorage).setItem(key, JSON.stringify(value)); } catch {} };
    const preferences = read("ricardo:preferences:v1", {});
    let mode = preferences.motion === "calm" ? "calm" : "full";
    let sound = preferences.sound === true;
    let audio;
    const W = window.Workshop = {
      read, save,
      get calm() { return reduce.matches || mode === "calm"; },
      get sound() { return sound; },
      emit(name, detail) { document.dispatchEvent(new CustomEvent("workshop:" + name, { detail })); },
      el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; },
      tone(frequency = 440) {
        if (!sound) return;
        try {
          audio ||= new (window.AudioContext || window.webkitAudioContext)();
          if (audio.state === "suspended") audio.resume();
          const oscillator = audio.createOscillator(), gain = audio.createGain();
          oscillator.connect(gain); gain.connect(audio.destination);
          oscillator.frequency.value = frequency; oscillator.type = "sine";
          gain.gain.setValueAtTime(.035, audio.currentTime);
          gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .13);
          oscillator.start(); oscillator.stop(audio.currentTime + .14);
        } catch {}
      },
      async copy(value, trigger) {
        try { await navigator.clipboard.writeText(value); W.announce("Copied to clipboard."); if (trigger) { const old = trigger.textContent; trigger.textContent = "Copied"; scope.timeout(() => trigger.textContent = old, 1600); } }
        catch { const d = W.dialog("Copy this link or text"); const field = W.el("textarea", "copy-fallback"); field.value = value; field.readOnly = true; d.content.append(field); d.show(); field.focus(); field.select(); }
      },
      announce(text) { if (W.status) W.status.textContent = text; },
      dialog(title) {
        const dialog = W.el("dialog", "workshop-dialog"), head = W.el("div", "dialog-head"), h = W.el("h2", "", title), close = W.el("button", "workshop-button", "Close");
        const id = "dialog-" + Math.random().toString(36).slice(2);
        h.id = id; dialog.setAttribute("aria-labelledby", id); close.type = "button"; close.setAttribute("aria-label", "Close " + title);
        head.append(h, close); const content = W.el("div", "dialog-content"); dialog.append(head, content); document.body.append(dialog); const removeDialog = scope.defer(() => { if (dialog.open) dialog.close(); dialog.remove(); });
        let opener = document.activeElement;
        scope.listen(close, "click", () => dialog.close());
        scope.listen(dialog, "click", e => { if (e.target === dialog) { const b = dialog.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close(); } });
        scope.listen(dialog, "close", () => { document.body.classList.remove("dialog-open"); opener?.focus?.(); W.emit("dialogclosed", dialog); removeDialog(); });
        return { dialog, content, show() { opener = document.activeElement; dialog.showModal(); document.body.classList.add("dialog-open"); close.focus(); } };
      },
      loop(element, tick, { manual = false } = {}) {
        let visible = false, frame = 0, last = 0, stopped = false;
        const run = time => { frame = 0; if (stopped || document.hidden || !visible || (!manual && W.calm)) return; const dt = Math.min((time - last) / 1000 || .016, .04); last = time; tick(dt, time); frame = requestAnimationFrame(run); };
        const sync = () => { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; if (!stopped && visible && !document.hidden && (manual || !W.calm)) frame = requestAnimationFrame(run); };
        const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { rootMargin: "80px" });
        observer.observe(element); document.addEventListener("visibilitychange", sync); document.addEventListener("workshop:motion", sync);
        return scope.defer(() => { stopped = true; cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", sync); document.removeEventListener("workshop:motion", sync); });
      }
    };

    function apply() {
      root.dataset.motion = W.calm ? "calm" : "full";
      save("ricardo:preferences:v1", { motion: mode, sound });
      W.emit("motion", { calm: W.calm });
      document.querySelectorAll("[data-motion-choice]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.motionChoice === (W.calm ? "calm" : "full"))));
      const note = document.querySelector("[data-motion-note]"); if (note) note.textContent = reduce.matches ? "Your device's reduced-motion preference is active." : "Your choice is saved on this device.";
    }
    apply(); scope.listen(reduce, "change", apply);

    function pong(host, onWin) {
      const canvas = W.el("canvas", "rally-canvas"); canvas.width = 720; canvas.height = 300; canvas.tabIndex = 0;
      canvas.setAttribute("aria-label", "Pong challenge. Move with Up and Down arrows, or drag on the court. Return five shots.");
      const controls = W.el("div", "workshop-actions"), play = W.el("button", "workshop-button", "Start rally"), reset = W.el("button", "workshop-button", "Reset"), result = W.el("p", "rally-score", "Return five shots. No timer. Play whenever you like.");
      const up = W.el("button", "workshop-button", "Paddle up"), down = W.el("button", "workshop-button", "Paddle down");
      [play, reset, up, down].forEach(b => b.type = "button"); controls.append(play, reset, up, down); host.append(canvas, controls, result);
      const ctx = canvas.getContext("2d"); let running = false, y = 115, other = 115, x = 360, by = 150, vx = -220, vy = 92, hits = 0, won = false;
      const clamp = v => Math.max(0, Math.min(230, v));
      function restart() { x = 360; by = 150; vx = -220; vy = 92; y = 115; hits = 0; won = false; result.textContent = "Return five shots. You control the left paddle."; paint(); }
      function paint() { ctx.fillStyle = "#0d0d0f"; ctx.fillRect(0, 0, 720, 300); ctx.strokeStyle = "#394258"; ctx.setLineDash([5, 10]); ctx.beginPath(); ctx.moveTo(360, 0); ctx.lineTo(360, 300); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#ff624b"; ctx.fillRect(20, y, 10, 70); ctx.fillStyle = "#8b9eff"; ctx.fillRect(690, other, 10, 70); ctx.fillStyle = "#f3f0e9"; ctx.beginPath(); ctx.arc(x, by, 6, 0, Math.PI * 2); ctx.fill(); }
      const stop = W.loop(canvas, dt => {
        if (!running) return; other += (by - 35 - other) * Math.min(1, dt * 7); other = clamp(other); x += vx * dt; by += vy * dt;
        if (by < 6) { by = 6; vy = Math.abs(vy); } if (by > 294) { by = 294; vy = -Math.abs(vy); }
        if (x < 36 && x > 8 && vx < 0 && by >= y - 5 && by <= y + 75) { x = 36; vx = Math.min(380, Math.abs(vx) * 1.04); vy = (by - y - 35) * 5; hits++; W.tone(430 + hits * 45); result.textContent = hits + " / 5 returns"; if (hits >= 5 && !won) { won = true; running = false; play.textContent = "Play again"; result.textContent = "Five returns! Your workshop welcome is unlocked."; save("ricardo:rally", true); W.emit("reward"); onWin?.(); } }
        if (x > 684 && vx > 0 && by >= other - 5 && by <= other + 75) { x = 684; vx = -Math.abs(vx); }
        if (x < 0 || x > 720) { x = 360; by = 150; vx = -220; vy = 92; result.textContent = "Keep going — " + hits + " / 5 returns."; }
        paint();
      }, { manual: true });
      scope.listen(play, "click", () => { if (won) restart(); running = !running; play.textContent = running ? "Pause rally" : "Resume rally"; canvas.focus(); });
      scope.listen(reset, "click", () => { running = false; restart(); play.textContent = "Start rally"; });
      const move = dy => { y = clamp(y + dy); paint(); };
      scope.listen(up, "click", () => move(-35)); scope.listen(down, "click", () => move(35));
      scope.listen(canvas, "keydown", e => { if (["ArrowUp", "ArrowDown", " "].includes(e.key)) { e.preventDefault(); if (e.key === " ") play.click(); else move(e.key === "ArrowUp" ? -28 : 28); } });
      const pointer = e => { const r = canvas.getBoundingClientRect(); y = clamp((e.clientY - r.top) * 300 / r.height - 35); paint(); };
      scope.listen(canvas, "pointerdown", e => { canvas.setPointerCapture(e.pointerId); pointer(e); }); scope.listen(canvas, "pointermove", e => { if (e.pointerType === "mouse" || canvas.hasPointerCapture(e.pointerId)) pointer(e); });
      paint(); return stop;
    }

    W.openRally = () => { const d = W.dialog("A little friendly competition"); d.content.append(W.el("p", "", "Control the amber paddle. Five returns unlock a welcome from Ricardo's avatar.")); const stop = pong(d.content); scope.listen(d.dialog, "close", stop, { once: true }); d.show(); };

    function init() {
      W.status = W.el("p", "sr-only"); W.status.setAttribute("role", "status"); W.status.setAttribute("aria-live", "polite"); document.body.append(W.status); scope.defer(() => W.status.remove());
      const settings = W.el("details", "workshop-settings"), summary = W.el("summary", "", "Experience"), panel = W.el("div", "experience-panel"), row = W.el("div", "workshop-actions");
      panel.append(W.el("strong", "", "Make yourself at home"));
      ["calm", "full"].forEach(value => { const b = W.el("button", "workshop-button", value === "calm" ? "Calm motion" : "Full motion"); b.type = "button"; b.dataset.motionChoice = value; scope.listen(b, "click", () => { mode = value; apply(); }); row.append(b); });
      const note = W.el("p", "experience-note"); note.dataset.motionNote = ""; panel.append(row, note);
      const audioButton = W.el("button", "workshop-button", sound ? "Sound on" : "Sound off"); audioButton.type = "button"; audioButton.setAttribute("aria-pressed", String(sound)); scope.listen(audioButton, "click", () => { sound = !sound; audioButton.textContent = sound ? "Sound on" : "Sound off"; audioButton.setAttribute("aria-pressed", String(sound)); apply(); W.tone(); });
      const rally = W.el("button", "workshop-button", "Play a rally"); rally.type = "button"; scope.listen(rally, "click", () => { settings.open = false; W.openRally(); }); panel.append(audioButton, rally); settings.append(summary, panel); document.body.append(settings); scope.defer(() => settings.remove()); if (window.self !== window.top) settings.hidden = true; apply();
      scope.listen(document, "pointerdown", e => { if (!settings.contains(e.target)) settings.open = false; });
      scope.listen(document, "keydown", e => { if (e.key === "Escape") settings.open = false; });

      document.querySelectorAll("img").forEach(img => { img.decoding = "async"; });
    }

    init();
    scope.defer(() => { delete window.Workshop; document.body.classList.remove("dialog-open"); });

}
