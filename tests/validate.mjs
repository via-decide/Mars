import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const scenarios = read('data/scenarios.json');
const rules = read('data/rules.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(Array.isArray(scenarios) && scenarios.length > 0, 'scenarios.json must contain scenarios');

for (const scenario of scenarios) {
  assert(scenario.id && scenario.title && Array.isArray(scenario.choices), `Scenario malformed: ${scenario.id}`);
  assert(scenario.choices.length >= 2, `Scenario needs at least two choices: ${scenario.id}`);
  for (const choice of scenario.choices) {
    assert(choice.id && choice.label && choice.effects, `Choice malformed in ${scenario.id}`);
  }
}

const sampleMetrics = { ...rules.initial };
for (const scenario of scenarios) {
  const first = scenario.choices[0];
  sampleMetrics.survival += first.effects.survival || 0;
  sampleMetrics.energy += first.effects.energy || 0;
  sampleMetrics.time += first.effects.time || 0;
  sampleMetrics.risk += first.effects.risk || 0;
}

const score = Math.round(
  sampleMetrics.survival * rules.weights.survival +
  sampleMetrics.energy * rules.weights.energy +
  sampleMetrics.time * rules.weights.time +
  sampleMetrics.risk * rules.weights.risk
);
assert(Number.isFinite(score), 'Scoring must produce a finite number');
assert(rules.bands.some((band) => score >= band.min), 'Score must map to a result band');

const routerSource = fs.readFileSync(path.join(root, 'assets/js/router.js'), 'utf8');
assert(routerSource.includes("'/results'"), 'Router must include /results route');
assert(routerSource.includes("'/about'"), 'Router must include /about route');

const storageSource = fs.readFileSync(path.join(root, 'assets/js/storage.js'), 'utf8');
assert(storageSource.includes('localStorage'), 'Storage module must persist to localStorage');

console.log('Validation checks passed.');
