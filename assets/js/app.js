import { getState, resetState, setState } from './state.js';
import { loadProgress, saveProgress, clearProgress } from './storage.js';
import { loadScenarios, loadRules, loadContent } from './scenarios.js';
import { recordDecision } from './decisions.js';
import { buildResultModel } from './results.js';
import { parseRoute, goTo, onRouteChange } from './router.js';
import { loadComponent, renderMetrics, showModal, initModal } from './ui.js';

let scenarios = [];
let rules;
let content;

function progressPercent() {
  return Math.round((getState().scenarioIndex / scenarios.length) * 100);
}

function pageTemplate(body) {
  return `<section class="card">${body}</section>`;
}

function renderHome(main) {
  main.innerHTML = pageTemplate(`
    <h1>${content.appTitle}</h1>
    <p class="muted">${content.tagline}</p>
    <p>${content.intro}</p>
    ${renderMetrics(getState().metrics)}
    <div class="intro-actions">
      <button class="primary" id="start-sim">Start Simulation</button>
      <button class="secondary" id="reset-sim">Reset Progress</button>
    </div>
  `);
  document.getElementById('start-sim').addEventListener('click', () => goTo('/scenario/0'));
  document.getElementById('reset-sim').addEventListener('click', () => {
    resetState();
    clearProgress();
    showModal('Simulation reset. You can start again from Scenario 1.');
    renderHome(main);
  });
}

function renderScenario(main, id) {
  const scenario = scenarios[id];
  if (!scenario) return goTo('/results');
  const percent = progressPercent();
  main.innerHTML = pageTemplate(`
    <header>
      <h1>${scenario.title}</h1>
      <p>${scenario.description}</p>
      <p class="muted">${scenario.context}</p>
      <p><strong>Step ${id + 1} of ${scenarios.length}</strong></p>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
    </header>
    ${renderMetrics(getState().metrics)}
    <section class="choice-list" aria-label="Available decisions">
      ${scenario.choices
        .map((choice) => `<button class="choice-btn" data-choice="${choice.id}">${choice.label}</button>`)
        .join('')}
    </section>
  `);

  main.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = scenario.choices.find((choice) => choice.id === button.dataset.choice);
      recordDecision(scenario.id, selected, rules);
      saveProgress();
      if (getState().scenarioIndex >= scenarios.length) goTo('/results');
      else goTo(`/scenario/${getState().scenarioIndex}`);
    });
  });
}

function renderResults(main) {
  const result = buildResultModel(getState(), rules);
  setState((draft) => ({ ...draft, score: result.score }));
  saveProgress();

  main.innerHTML = pageTemplate(`
    <h1>Mission Results</h1>
    <p><strong>Overall Score:</strong> ${result.score}/100</p>
    <p><strong>Survival Likelihood:</strong> ${result.band.label}</p>
    <p>${result.band.summary}</p>
    ${renderMetrics(getState().metrics)}
    <h2>Decision Summary</h2>
    <ul class="summary-list">
      ${getState().decisions.map((item) => `<li><strong>${item.scenarioId}:</strong> ${item.label}</li>`).join('')}
    </ul>
    <p><strong>Best Choice:</strong> ${result.extremes.best ? result.extremes.best.label : 'N/A'}</p>
    <p><strong>Worst Choice:</strong> ${result.extremes.worst ? result.extremes.worst.label : 'N/A'}</p>
    <h3>Recommendations</h3>
    <ul class="summary-list">${result.recommendations.map((item) => `<li>${item}</li>`).join('')}</ul>
    <div class="result-actions">
      <button class="primary" id="retry">Retry Simulation</button>
      <a class="secondary" href="#/about">About this lab</a>
    </div>
  `);

  document.getElementById('retry').addEventListener('click', () => {
    resetState();
    clearProgress();
    goTo('/');
  });
}

function renderAbout(main) {
  main.innerHTML = pageTemplate(`
    <article>
      <h1>${content.about.title}</h1>
      <p>${content.about.body}</p>
      <p class="muted">All scenarios, scoring weights, and recommendations are loaded from JSON for easy extension.</p>
    </article>
  `);
}

function render(route, params) {
  const main = document.querySelector('main');
  if (route === '/') return renderHome(main);
  if (route === '/scenario') return renderScenario(main, Number.isFinite(params.id) ? params.id : getState().scenarioIndex);
  if (route === '/results') return renderResults(main);
  if (route === '/about') return renderAbout(main);
  return renderHome(main);
}

async function bootstrap() {
  await loadComponent('../components/header.html', document.getElementById('site-header'));
  await loadComponent('../components/footer.html', document.getElementById('site-footer'));
  await loadComponent('../components/modal.html', document.getElementById('modal-root'));
  initModal();

  [scenarios, rules, content] = await Promise.all([loadScenarios(), loadRules(), loadContent()]);
  loadProgress();

  const parsed = parseRoute();
  if (parsed.route === '/scenario' && parsed.params.id > getState().scenarioIndex) {
    goTo(`/scenario/${getState().scenarioIndex}`);
    return;
  }
  render(parsed.route, parsed.params);
  onRouteChange(({ route, params }) => render(route, params));
}

bootstrap().catch((error) => {
  document.querySelector('main').innerHTML = `<section class="card"><h1>Load error</h1><p>${error.message}</p><p class="muted">If you opened this file directly, serve the folder with <code>python -m http.server</code>.</p></section>`;
});
