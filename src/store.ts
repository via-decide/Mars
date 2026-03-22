import { useSyncExternalStore } from 'react';

export const initialState = {
  energy: 84, solNumber: 127, timeFrac: 0.42, dust: 0.05, risk: 0,
  instrumentCooldown: 0, instrumentReliability: 1.0,
  roverState: 'IDLE', stormActive: false, isCharging: false,
  scanningActive: false, stepCount: 0, latencyMs: 1200,
  nodeProximity: 0, xp: 0, tier: 1, validation: 0,
  missionsCompleted: [] as number[], currentMissionId: 1,
  metrics: { moves: 0, scans: 0, correct: 0, wrong: 0, slips: 0, storms: 0, latencyPenalty: 0, stormHalt: 0, stormOverride: 0 },
  log: [] as any[], runId: null as string | null, startTs: null as string | null, endedTs: null as string | null,
  lastRunSurvivalIndex: null as number | null, skillNodes: {} as Record<string, boolean>, badges: [] as string[], role: 'student',
  difficulty: 'cadet', activeModifiers: [] as any[], comboScans: 0, lastScanTs: 0, terrainEventOpen: false, guestMode: false,
  currentScreen: 'landing',
  modals: {
    node: false,
    challenge: false,
    result: false,
    storm: false,
    efail: false,
    terrainEvent: false,
    risk: false,
    certViewer: false,
    demoLogin: false,
    end: false,
  },
  currentTerrain: null as any,
  currentChallenge: null as any,
  resultData: null as any,
  terrainEventData: null as any,
  certViewLevel: null as number | null,
  toasts: [] as { id: number, msg: string }[],
  rocksOffset: 0,
  lowPerfMode: false,
  coachTipIdx: 0,
  coachTipVisible: false,
  camPan: 0,
  camTilt: 0,
};

export type GameState = typeof initialState;

class Store {
  state = initialState;
  listeners = new Set<() => void>();

  getState = () => this.state;

  setState = (fn: (state: GameState) => void) => {
    const nextState = { ...this.state };
    fn(nextState);
    console.log('[store] State updated:', nextState);
    this.state = nextState;
    this.listeners.forEach(l => l());
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}

export const store = new Store();
export const useGameStore = () => useSyncExternalStore(store.subscribe, store.getState);

export function setScreen(screen: string) {
  store.setState(s => { s.currentScreen = screen; });
}

export function openModal(modal: keyof GameState['modals']) {
  store.setState(s => { s.modals[modal] = true; });
}

export function closeModal(modal: keyof GameState['modals']) {
  store.setState(s => { s.modals[modal] = false; });
}

export function closeAllModals() {
  store.setState(s => {
    for (const key in s.modals) {
      s.modals[key as keyof GameState['modals']] = false;
    }
  });
}

let toastId = 0;
export function toast(msg: string) {
  const id = ++toastId;
  store.setState(s => {
    s.toasts.push({ id, msg });
  });
  setTimeout(() => {
    store.setState(s => {
      s.toasts = s.toasts.filter(t => t.id !== id);
    });
  }, 3000);
}

export function logEvent(type: string, data: any) {
  store.setState(s => {
    s.log.push({ ts: new Date().toISOString(), type, ...data });
  });
}

export function updateCamera(pan: number, tilt: number) {
  store.setState(s => {
    s.camPan = Math.max(-45, Math.min(45, s.camPan + pan));
    s.camTilt = Math.max(-20, Math.min(20, s.camTilt + tilt));
  });
}

export function resetCamera() {
  store.setState(s => {
    s.camPan = 0;
    s.camTilt = 0;
  });
}
