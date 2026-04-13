export function applyChoiceEffects(metrics, effects) {
  return {
    survival: Math.max(0, metrics.survival + (effects.survival || 0)),
    energy: Math.max(0, metrics.energy + (effects.energy || 0)),
    time: Math.max(0, metrics.time + (effects.time || 0)),
    risk: Math.max(0, metrics.risk + (effects.risk || 0))
  };
}

export function computeScore(metrics, rules) {
  const { weights } = rules;
  const raw =
    metrics.survival * weights.survival +
    metrics.energy * weights.energy +
    metrics.time * weights.time +
    metrics.risk * weights.risk;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function evaluateBand(score, bands) {
  return bands.find((band) => score >= band.min) || bands[bands.length - 1];
}
