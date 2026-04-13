import { computeScore, evaluateBand } from './scoring.js';
import { getBestAndWorst } from './decisions.js';

export function buildResultModel(state, rules) {
  const score = computeScore(state.metrics, rules);
  const band = evaluateBand(score, rules.bands);
  const extremes = getBestAndWorst(state.decisions);
  const recommendations = [];
  if (state.metrics.risk > 25) recommendations.push(rules.recommendations.highRisk);
  if (state.metrics.energy < 40) recommendations.push(rules.recommendations.lowEnergy);
  if (state.metrics.time < 12) recommendations.push(rules.recommendations.lowTime);
  return {
    score,
    band,
    extremes,
    recommendations: recommendations.length ? recommendations : ['Maintain balanced decisions across safety, time, and resources.']
  };
}
