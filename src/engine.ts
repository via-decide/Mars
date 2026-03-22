import { store, toast, logEvent, openModal, closeModal, closeAllModals, setScreen } from './store';
import { MARS, DIFFICULTY_PRESETS, MISSION_MODIFIERS_POOL, TERRAINS, CHALLENGES } from './constants';

export function isNight() {
  const { timeFrac } = store.getState();
  return timeFrac > MARS.NIGHT_START || timeFrac < MARS.NIGHT_END;
}

export function solarEff() {
  const { dust } = store.getState();
  return isNight() ? 0 : (1 - dust);
}

export function advanceTime(frac: number) {
  store.setState(s => {
    s.timeFrac += frac;
    if (s.timeFrac >= 1) {
      s.timeFrac -= 1;
      s.solNumber++;
      toast('SOL ' + s.solNumber + ' — NEW MARTIAN DAY');
    }
  });
}

export function updateDust() {
  store.setState(s => {
    s.dust += s.stormActive ? 0.008 : 0.001;
    s.dust = Math.min(0.9, s.dust);
  });
}

export function updateEnergyPassive() {
  store.setState(s => {
    if (s.isCharging) { s.energy += solarEff() * 0.5; }
    else if (isNight()) { s.energy -= 0.15; }
    else { s.energy += solarEff() * 0.3; }
    s.energy = Math.max(0, Math.min(100, s.energy));
  });
}

export function riskCheck() {
  const s = store.getState();
  if (s.risk >= MARS.MAX_RISK) {
    store.setState(st => { st.endedTs = new Date().toISOString(); });
    logEvent('RUN_END', { reason: 'RISK_BUDGET' });
    closeAllModals();
    openModal('risk');
  }
}

export function getDifficultyPreset() {
  const { difficulty } = store.getState();
  return DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.cadet;
}

export function selectActiveModifiers() {
  store.setState(s => {
    const seed = (new Date().getUTCDate() + s.solNumber + s.tier) % MISSION_MODIFIERS_POOL.length;
    const m1 = MISSION_MODIFIERS_POOL[seed];
    const m2 = MISSION_MODIFIERS_POOL[(seed + 2) % MISSION_MODIFIERS_POOL.length];
    s.activeModifiers = [m1, m2];
  });
}

export function aggregateModifier(key: string) {
  const { activeModifiers } = store.getState();
  return activeModifiers.reduce((acc, m) => acc + ((m.apply && m.apply[key]) || 0), 0);
}

export function registerScanCombo() {
  const now = Date.now();
  store.setState(s => {
    if (now - s.lastScanTs < 30000) {
      s.comboScans += 1;
    } else {
      s.comboScans = 1;
    }
    s.lastScanTs = now;
  });
}

export function modEnergy(d: number) {
  store.setState(s => {
    s.energy = Math.max(0, Math.min(100, s.energy + d));
  });
}

export function setState(st: string) {
  store.setState(s => { s.roverState = st; });
}

export function triggerStorm() {
  store.setState(s => {
    s.stormActive = true;
    s.latencyMs = Math.min(3500, s.latencyMs + 800);
    s.roverState = 'STORM';
  });
  openModal('storm');
  logEvent('STORM_START', { dust: store.getState().dust });
}

export function pauseForStorm() {
  closeModal('storm');
  store.setState(s => {
    s.risk += 2;
    s.metrics.stormHalt++;
    s.isCharging = true;
  });
  toast('HALTED — AWAITING STORM PASSAGE');
  setTimeout(() => {
    store.setState(s => {
      s.stormActive = false;
      s.isCharging = false;
      s.latencyMs = Math.max(1200, s.latencyMs - 800);
    });
    toast('STORM CLEARED — RESUMING OPERATIONS');
    logEvent('STORM_END', { via: 'HALT' });
    checkSkillUnlocks();
  }, 7000);
}

export function overrideStorm() {
  store.setState(s => {
    s.risk += 8;
    s.metrics.stormOverride++;
    s.stormActive = false;
    s.latencyMs = Math.max(1200, s.latencyMs - 800);
  });
  closeModal('storm');
  toast('OVERRIDE ACCEPTED — RISK +8');
  logEvent('STORM_OVERRIDE', { risk: store.getState().risk });
  riskCheck();
}

export function showEnergyFail() {
  store.setState(s => { s.endedTs = new Date().toISOString(); });
  logEvent('RUN_END', { reason: 'ENERGY_DEPLETED' });
  openModal('efail');
}

export function solarRecover() {
  closeModal('efail');
  store.setState(s => { s.isCharging = true; });
  toast('SOLAR RECOVERY INITIATED');
  const iv = setInterval(() => {
    modEnergy(+3);
    if (store.getState().energy >= 25) {
      clearInterval(iv);
      store.setState(s => { s.isCharging = false; });
      toast('ENERGY RESTORED');
    }
  }, 1200);
}

export function computeSurvivalIndex() {
  const s = store.getState();
  const total = s.metrics.correct + s.metrics.wrong;
  const acc = total > 0 ? s.metrics.correct / total : 0;
  const p1 = Math.min(50, s.validation * 10);
  const depl = s.energy <= 0 ? 0.5 : 1;
  const p2 = (s.energy / 100) * 50 * depl;
  const p3 = (1 - Math.min(1, s.risk / 100)) * 40;
  const p4 = acc * 30;
  const safeMoves = Math.max(0, s.metrics.moves - s.metrics.slips);
  const p5 = s.metrics.moves > 0 ? (safeMoves / s.metrics.moves) * 20 : 10;
  return Math.round(((p1 + p2 + p3 + p4 + p5) / 190) * 100);
}

export function checkSkillUnlocks() {
  store.setState(s => {
    const m = s.metrics;
    const n = (id: string) => {
      if (!s.skillNodes[id]) {
        s.skillNodes[id] = true;
        toast('SKILL UNLOCKED: ' + id.toUpperCase());
      }
    };
    if (s.missionsCompleted.includes(1)) n('e1');
    if (m.stormHalt >= 3) n('e3');
    if (s.missionsCompleted.length >= 5) n('e2');
    if (s.tier >= 3) n('e4');
    if (m.scans >= 5) n('g1');
    if (m.correct >= 3) n('g2');
    if (s.skillNodes['g2']) n('g3');
    if (s.missionsCompleted.includes(4)) n('g4');
    if (m.slips >= 1) n('r1');
    if (s.missionsCompleted.includes(5)) { n('r2'); n('r3'); }
    if (s.tier >= 4) n('r4');
    if (s.missionsCompleted.length >= 3) n('s1');
    if ((m.stormHalt + m.stormOverride) >= 5) n('s2');
    if (s.missionsCompleted.includes(6)) n('s3');
    if (s.skillNodes['s1']) n('s4');
  });
}

export function checkBadges() {
  store.setState(s => {
    const add = (b: string) => {
      if (!s.badges.includes(b)) {
        s.badges.push(b);
        toast('🏅 BADGE EARNED: ' + b);
      }
    };
    if (s.energy > 0 && s.metrics.scans >= 5) add('Solar Strategist');
    if (s.metrics.correct >= 10 && s.metrics.wrong === 0) add('Iron Geologist');
    if (s.metrics.stormHalt >= 5) add('Storm Veteran');
    if (s.missionsCompleted.includes(5) && s.risk < 40) add('Risk Architect');
    if (s.metrics.scans >= 1) add('First Contact');
    if (s.metrics.moves >= 20 && s.metrics.slips <= 1) add('Precision Driver');
    if (s.metrics.stormOverride >= 3 && s.metrics.correct >= 5) add('Rapid Commander');
    if (s.comboScans >= 3) add('Signal Chain');
  });
}

export function endMission() {
  closeAllModals();
  store.setState(s => {
    if (!s.endedTs) s.endedTs = new Date().toISOString();
    if (!s.missionsCompleted.includes(s.currentMissionId)) {
      s.missionsCompleted.push(s.currentMissionId);
    }
    s.lastRunSurvivalIndex = computeSurvivalIndex();
    if (s.missionsCompleted.length >= 3 && s.tier < 2) s.tier = 2;
    if (s.missionsCompleted.length >= 5 && s.tier < 3) s.tier = 3;
  });
  logEvent('RUN_END', { reason: 'MANUAL' });
  checkSkillUnlocks();
  checkBadges();
  toast('MISSION COMPLETE — SURVIVAL INDEX: ' + store.getState().lastRunSurvivalIndex + '%');
  setScreen('dar');
}

export function openNodeModal() {
  const terrain = TERRAINS[Math.floor(Math.random() * TERRAINS.length)];
  store.setState(s => { s.currentTerrain = terrain; });
  openModal('node');
}

export function initiateScan(mode = 'deep') {
  closeModal('node');
  const s = store.getState();
  const cost = mode === 'quick' ? 4 : 8;
  if (s.energy < cost) { toast('INSUFFICIENT ENERGY'); return; }

  advanceTime(0.02);
  updateDust();
  modEnergy(-cost);
  
  store.setState(st => {
    st.scanningActive = true;
    st.metrics.scans++;
    st.roverState = 'SCANNING';
  });
  
  logEvent('SCAN_START', { terrain: s.currentTerrain?.name, mode });

  setTimeout(() => {
    const st = store.getState();
    const successChance = st.instrumentReliability - st.dust * 0.4;
    let riskAdded = 0;
    if (Math.random() > successChance) {
      riskAdded = 4;
      toast('INSTRUMENT ANOMALY — SCAN DEGRADED');
      logEvent('SCAN_ANOMALY', { risk: st.risk + 4 });
    }
    
    store.setState(s2 => {
      s2.scanningActive = false;
      if (riskAdded) {
        s2.risk += riskAdded;
        s2.metrics.slips++;
      }
      s2.instrumentCooldown = mode === 'quick' ? 2 : 3 + aggregateModifier('cooldownAdd');
      s2.roverState = 'IDLE';
    });

    if (mode === 'quick') {
      showResult(true, { quickProbe: true, expOverride: 'Quick probe captured partial spectral confidence. Run a deep scan for full validation.' });
      riskCheck();
      return;
    }

    openChallenge();
    riskCheck();
  }, 2000);
}

export function openChallenge() {
  const c = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  store.setState(s => { s.currentChallenge = c; });
  openModal('challenge');
}

export function evaluateAnswer(idx: number) {
  const s = store.getState();
  const correct = s.currentChallenge.options[idx].correct;
  
  store.setState(st => {
    st.resultData = {
      correct,
      selectedIndex: idx,
      options: st.currentChallenge.options
    };
  });
  
  logEvent('ANSWER', { correct, cat: s.currentChallenge.category });
  
  setTimeout(() => {
    closeModal('challenge');
    showResult(correct);
  }, 1100);
}

export function showResult(correct: boolean, opts: any = {}) {
  const preset = getDifficultyPreset();
  
  store.setState(s => {
    if (correct) {
      const energyGain = opts.quickProbe ? 6 : 12;
      const xpGain = Math.round((opts.quickProbe ? 10 : 20) * preset.xpMult);
      const riskDrop = opts.quickProbe ? 1 : 3;
      
      s.energy = Math.max(0, Math.min(100, s.energy + energyGain + aggregateModifier('energyGainBonus')));
      s.validation = Math.min(5, s.validation + 1);
      s.risk = Math.max(0, s.risk - riskDrop);
      s.xp += xpGain;
      s.metrics.correct++;
      
      s.resultData = {
        ...s.resultData,
        correct: true,
        title: 'TRANSMISSION LOGGED',
        deltas: [
          { val: '+' + energyGain + '%', label: 'Energy', pos: true },
          { val: '+1', label: 'Validation', pos: true },
          { val: '-' + riskDrop, label: 'Risk', pos: true },
          { val: '+' + xpGain, label: 'XP', pos: true },
        ],
        expText: opts.expOverride || s.currentChallenge?.exp
      };
    } else {
      s.energy = Math.max(0, Math.min(100, s.energy - 6));
      s.latencyMs = Math.min(3000, s.latencyMs + 400);
      s.risk += Math.ceil(4 * preset.riskMult);
      s.xp = Math.max(0, s.xp - 5);
      s.metrics.wrong++;
      s.metrics.latencyPenalty += 400;
      
      s.resultData = {
        ...s.resultData,
        correct: false,
        title: 'ANALYSIS FAILED',
        deltas: [
          { val: '-6%', label: 'Energy', pos: false },
          { val: '+0.4s', label: 'Latency', pos: false },
          { val: '+4', label: 'Risk', pos: false },
        ],
        expText: opts.expOverride || s.currentChallenge?.exp
      };
    }
  });

  registerScanCombo();
  const s2 = store.getState();
  if (s2.comboScans >= 2) {
    const comboXp = s2.comboScans >= 4 ? 8 : 4;
    store.setState(s => { s.xp += comboXp; });
    toast('COMBO x' + s2.comboScans + ' — +' + comboXp + ' XP');
  }

  store.setState(s => { s.scanningActive = false; });
  openModal('result');
  
  if (!correct) {
    riskCheck();
  }
  
  checkSkillUnlocks();
  checkBadges();
}

let moveTimeout: any = null;

export function move(dir: string) {
  console.log('[engine] move called with dir:', dir);
  const s = store.getState();
  if (s.scanningActive) { console.log('[engine] move blocked: scanningActive'); toast('CANNOT MOVE DURING SCAN'); return; }
  if (s.energy <= 5) { console.log('[engine] move blocked: energy <= 5'); toast('CRITICAL ENERGY — MOVEMENT BLOCKED'); return; }
  if (s.roverState === 'MOVING') { console.log('[engine] move blocked: already MOVING'); return; }

  console.log('[engine] move accepted, setting state to MOVING');
  setState('MOVING');

  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    console.log('[engine] moveTimeout fired');
    advanceTime(0.01);
    updateDust();

    const st = store.getState();
    if (Math.random() < st.dust * 0.6) {
      store.setState(s2 => {
        s2.risk += 5;
        s2.metrics.slips++;
      });
      logEvent('DUST_SLIP', { dust: st.dust, riskNow: st.risk + 5 });
      toast('TRACTION LOSS — DUST HAZARD');
    }

    riskCheck();
    if (store.getState().risk >= MARS.MAX_RISK) return;

    const preset = getDifficultyPreset();
    const drain = (1.5 + Math.random() * 0.5 + (isNight() ? 0.5 : 0) + aggregateModifier('energyDrainAdd')) * preset.energyMult;
    
    store.setState(s2 => {
      s2.energy = Math.max(0, Math.min(100, s2.energy - drain));
      s2.metrics.moves++;
      s2.stepCount++;
      s2.xp += 2;
      
      const shifts: Record<string, number> = { N: 0, S: 0, E: -2, W: 2, NE: -1, NW: 1, SE: -1, SW: 1 };
      s2.rocksOffset += (shifts[dir] || 0);
    });

    if (!st.stormActive && Math.random() < st.dust * 0.3) {
      store.setState(s2 => { s2.metrics.storms++; });
      triggerStorm();
    }

    store.setState(s2 => {
      s2.nodeProximity += 0.18 + Math.random() * 0.08;
      if (s2.nodeProximity >= 1) {
        s2.nodeProximity = 0;
        openNodeModal();
      }
    });

    logEvent('MOVE', { dir, drain, risk: store.getState().risk });
    setState('IDLE');

    const finalS = store.getState();
    if (finalS.energy <= 0) { showEnergyFail(); }
  }, s.latencyMs);
}

export function doScan() {
  console.log('[engine] doScan called');
  const s = store.getState();
  if (s.instrumentCooldown > 0) { console.log('[engine] doScan blocked: cooldown'); toast('INSTRUMENT COOLING — ' + s.instrumentCooldown + 's'); return; }
  if (s.energy < 8) { console.log('[engine] doScan blocked: low energy'); toast('INSUFFICIENT ENERGY FOR SCAN'); return; }
  if (s.scanningActive) { console.log('[engine] doScan blocked: already scanning'); return; }
  if (s.roverState === 'MOVING') { console.log('[engine] doScan blocked: moving'); toast('CEASE MOVEMENT BEFORE SCANNING'); return; }
  
  console.log('[engine] doScan accepted, opening node modal');
  openNodeModal();
}

export function constraintTick() {
  const s = store.getState();
  if (s.currentScreen !== 'sim') return;
  
  store.setState(st => {
    if (st.instrumentCooldown > 0) st.instrumentCooldown--;
  });
  
  advanceTime(0.0006);
  updateDust();
  updateEnergyPassive();
}

export function enterAs(role: string) {
  store.setState(s => {
    s.role = role;
    s.guestMode = role === 'demo';
    s.runId = Math.random().toString(36).substring(2, 10);
    s.startTs = new Date().toISOString();
  });
  selectActiveModifiers();
  logEvent('SESSION_START', { role });
  
  if (role === 'teacher') {
    setScreen('teacher');
  } else {
    setScreen('sim');
    toast(role === 'demo' ? 'GUEST DRILL ONLINE — MISSION ACTIVE' : 'HEX-01 ONLINE — MISSION ACTIVE');
    toast('MODIFIERS: ' + store.getState().activeModifiers.map(m => m.name).join(' · '));
  }
}
