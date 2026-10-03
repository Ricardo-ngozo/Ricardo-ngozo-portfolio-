/** Resources belong to a mounted page; disposing a page stops its work. */
export function createPageScope() {
  const controller = new AbortController();
  const cleanups = new Set();
  let disposed = false;
  const defer = cleanup => {
    let done = false;
    const once = () => { if (!done) { done = true; cleanups.delete(once); cleanup(); } };
    if (disposed) once(); else cleanups.add(once);
    return once;
  };
  const observer = Type => class extends Type {
    constructor(callback, options) {
      super((...args) => { if (!disposed) callback(...args); }, options);
      defer(() => this.disconnect());
    }
  };
  const scope = {
    signal: controller.signal,
    get active() { return !disposed; },
    defer,
    listen(target, type, callback, options) {
      if (!target || disposed) return;
      target.addEventListener(type, callback, options);
      defer(() => target.removeEventListener(type, callback, options));
    },
    timeout(callback, delay) {
      if (disposed) return;
      const id = window.setTimeout(() => { if (!disposed) callback(); }, delay);
      defer(() => window.clearTimeout(id));
      return id;
    },
    interval(callback, delay) {
      if (disposed) return;
      const id = window.setInterval(() => { if (!disposed) callback(); }, delay);
      defer(() => window.clearInterval(id));
      return id;
    },
    frame(callback) {
      if (disposed) return;
      const id = window.requestAnimationFrame(time => { if (!disposed) callback(time); });
      defer(() => window.cancelAnimationFrame(id));
      return id;
    },
    element(tag) {
      const node = document.createElement(tag);
      defer(() => node.remove());
      return node;
    },
    async fetch(url, options = {}) {
      const request = new AbortController();
      const abort = () => request.abort();
      const signals = [controller.signal, options.signal].filter(Boolean);
      signals.forEach(signal => {
        if (signal.aborted) abort();
        else signal.addEventListener('abort', abort, { once: true });
      });
      try { return await window.fetch(url, { ...options, signal: request.signal }); }
      finally { signals.forEach(signal => signal.removeEventListener('abort', abort)); }
    },
    workshop(base = window.Workshop) {
      if (!base) throw new Error('Workshop must mount before page features.');
      const local = Object.create(base);
      local.el = (...args) => { const node = base.el(...args); defer(() => node.remove()); return node; };
      local.loop = (...args) => defer(base.loop(...args));
      local.dialog = (...args) => {
        const result = base.dialog(...args);
        defer(() => { if (result.dialog.open) result.dialog.close(); result.dialog.remove(); });
        return result;
      };
      return local;
    },
    IntersectionObserver: observer(window.IntersectionObserver),
    ResizeObserver: observer(window.ResizeObserver),
    MutationObserver: observer(window.MutationObserver),
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      for (const cleanup of [...cleanups].reverse()) { try { cleanup(); } catch (error) { console.warn('Page cleanup failed', error); } }
      cleanups.clear();
    }
  };
  return scope;
}
