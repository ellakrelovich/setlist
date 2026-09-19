// Minimal hash-based router. Hash routing avoids any GitHub Pages
// sub-path / 404 configuration entirely, since every route resolves
// to the same index.html and the part after "#" is handled client-side.

const routes = [];
let notFoundHandler = () => document.createElement('div');
let rootEl = null;
let currentCleanup = null;

export function registerRoute(pattern, handler) {
  // pattern like '/artist/:id'
  const paramNames = [];
  const regexStr = '^' + pattern.replace(/:[^/]+/g, (m) => {
    paramNames.push(m.slice(1));
    return '([^/]+)';
  }) + '/?$';
  routes.push({ regex: new RegExp(regexStr), paramNames, handler });
}

export function registerNotFound(handler) { notFoundHandler = handler; }

export function navigate(path) {
  if (location.hash.replace(/^#/, '') === path) {
    render();
  } else {
    location.hash = path;
  }
}

export function currentPath() {
  const h = location.hash.replace(/^#/, '');
  return h || '/';
}

function matchRoute(path) {
  const [pathname] = path.split('?');
  for (const r of routes) {
    const m = pathname.match(r.regex);
    if (m) {
      const params = {};
      r.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
      return { handler: r.handler, params };
    }
  }
  return null;
}

export function getQuery() {
  const hash = location.hash.replace(/^#/, '');
  const qIndex = hash.indexOf('?');
  const params = new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex + 1) : '');
  return params;
}

async function render() {
  const path = currentPath();
  const match = matchRoute(path);
  rootEl.innerHTML = '';
  window.scrollTo(0, 0);
  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch (e) { /* noop */ }
    currentCleanup = null;
  }
  let node;
  if (match) {
    node = await match.handler({ params: match.params, query: getQuery() });
  } else {
    node = await notFoundHandler();
  }
  if (node && node.__cleanup) currentCleanup = node.__cleanup;
  rootEl.appendChild(node);
  document.dispatchEvent(new CustomEvent('route:changed', { detail: { path } }));
}

export function startRouter(el) {
  rootEl = el;
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '/';
  render();
}
