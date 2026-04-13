export async function loadComponent(path, target) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load component: ${path}`);
  target.innerHTML = await res.text();
}

export function renderMetrics(metrics) {
  return `<section class="metric-grid" aria-label="Current mission metrics">
    ${Object.entries(metrics)
      .map(([key, value]) => `<article class="metric"><h3>${key}</h3><p>${value}</p></article>`)
      .join('')}
  </section>`;
}

export function showModal(message) {
  const modal = document.getElementById('status-modal');
  if (!modal) return;
  document.getElementById('modal-message').textContent = message;
  modal.hidden = false;
}

export function initModal() {
  const close = document.getElementById('close-modal');
  const modal = document.getElementById('status-modal');
  if (close && modal) close.addEventListener('click', () => (modal.hidden = true));
}
