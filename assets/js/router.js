const ROUTES = ['/', '/scenario', '/results', '/about'];

export function parseRoute(hash = window.location.hash) {
  const value = hash.replace('#', '') || '/';
  const parts = value.split('/').filter(Boolean);
  if (!parts.length) return { route: '/', params: {} };
  if (parts[0] === 'scenario') {
    return { route: '/scenario', params: { id: Number(parts[1] || 0) } };
  }
  const route = `/${parts[0]}`;
  return { route: ROUTES.includes(route) ? route : '/', params: {} };
}

export function goTo(path) {
  window.location.hash = `#${path}`;
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', () => handler(parseRoute()));
}
