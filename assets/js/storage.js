import { getState, hydrateState } from './state.js';

const KEY = 'mars-decision-lab-v1';

export function saveProgress() {
  localStorage.setItem(KEY, JSON.stringify(getState()));
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return hydrateState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearProgress() {
  localStorage.removeItem(KEY);
}
