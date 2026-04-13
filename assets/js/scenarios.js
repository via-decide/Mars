let cache = null;

export async function loadScenarios() {
  if (cache) return cache;
  const res = await fetch('../data/scenarios.json');
  if (!res.ok) throw new Error('Unable to load scenarios.json');
  cache = await res.json();
  return cache;
}

export async function loadRules() {
  const res = await fetch('../data/rules.json');
  if (!res.ok) throw new Error('Unable to load rules.json');
  return res.json();
}

export async function loadContent() {
  const res = await fetch('../data/content.json');
  if (!res.ok) throw new Error('Unable to load content.json');
  return res.json();
}
