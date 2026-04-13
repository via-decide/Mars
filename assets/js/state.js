const initialState = {
  scenarioIndex: 0,
  decisions: [],
  metrics: { survival: 50, energy: 50, time: 20, risk: 10 },
  score: null
};

let state = structuredClone(initialState);

export function getState() {
  return state;
}

export function setState(updater) {
  state = typeof updater === 'function' ? updater(structuredClone(state)) : { ...state, ...updater };
  return state;
}

export function resetState() {
  state = structuredClone(initialState);
  return state;
}

export function hydrateState(nextState) {
  state = { ...structuredClone(initialState), ...nextState };
  return state;
}
