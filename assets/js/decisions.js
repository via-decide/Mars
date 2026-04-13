import { getState, setState } from './state.js';
import { applyChoiceEffects } from './scoring.js';

export function recordDecision(scenarioId, choice, rules) {
  const current = getState();
  const metrics = applyChoiceEffects(current.metrics, choice.effects);
  return setState((draft) => {
    draft.decisions = [...current.decisions, { scenarioId, choiceId: choice.id, label: choice.label, effects: choice.effects }];
    draft.metrics = metrics;
    draft.scenarioIndex = current.scenarioIndex + 1;
    return draft;
  });
}

export function getBestAndWorst(decisions) {
  if (!decisions.length) return { best: null, worst: null };
  const bySurvival = [...decisions].sort((a, b) => (b.effects.survival || 0) - (a.effects.survival || 0));
  return { best: bySurvival[0], worst: bySurvival[bySurvival.length - 1] };
}
