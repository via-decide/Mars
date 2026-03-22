import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, openModal, store, updateCamera, resetCamera } from '../store';
import { move, doScan, isNight } from '../engine';

const CAM_ACCEL = 0.15;
const CAM_FRICTION = 0.85;
const CAM_MAX_SPEED = 2.5;

export default function SimScreen() {
  const state = useGameStore();
  const [swipeIndicator, setSwipeIndicator] = useState<{ dir: string, x: number, y: number } | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const touchStart = useRef<{ x: number, y: number, time: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const camInput = useRef({ pan: 0, tilt: 0 });
  const camVelocity = useRef({ pan: 0, tilt: 0 });
  const rafRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchStart.current) return;
    const dx = e.clientX - touchStart.current.x;
    const dy = e.clientY - touchStart.current.y;
    const duration = Date.now() - touchStart.current.time;
    touchStart.current = null;

    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Require at least 40px of movement and a quick gesture (under 800ms) to distinguish from taps/drags
    if (distance < 40 || duration > 800) return;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    let dir = '';

    if (angle >= -22.5 && angle < 22.5) dir = 'E';
    else if (angle >= 22.5 && angle < 67.5) dir = 'SE';
    else if (angle >= 67.5 && angle < 112.5) dir = 'S';
    else if (angle >= 112.5 && angle < 157.5) dir = 'SW';
    else if (angle >= 157.5 || angle < -157.5) dir = 'W';
    else if (angle >= -157.5 && angle < -112.5) dir = 'NW';
    else if (angle >= -112.5 && angle < -67.5) dir = 'N';
    else if (angle >= -67.5 && angle < -22.5) dir = 'NE';

    if (dir && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSwipeIndicator({ dir, x, y });
      setTimeout(() => setSwipeIndicator(null), 600);
      console.log('[SimScreen] Swipe detected:', dir, 'distance:', Math.round(distance), 'duration:', duration);
      move(dir);
    }
  };

  const getBtnClass = (dir: string) => {
    const base = "dir-btn flex items-center justify-center bg-[#181B22] border border-[#ffffff12] text-[#6B6860] text-[14px] cursor-pointer transition-all duration-120 touch-manipulation select-none";
    const active = "bg-[rgba(214,64,0,0.15)] border-[#D64000] text-[#FF6B35] shadow-[0_0_10px_rgba(214,64,0,0.3)] scale-95";
    return `${base} ${pressedBtn === dir ? active : ''}`;
  };

  const getScanBtnClass = () => {
    const base = "dir-btn scan-btn flex items-center justify-center bg-[#181B22] border border-[#ffffff12] text-[#6B6860] cursor-pointer transition-all duration-120 touch-manipulation font-mono text-[8px] tracking-[0.5px] select-none";
    const active = "text-[#3DFF8F] border-[#3DFF8F] bg-[#1A4D35] shadow-[0_0_10px_rgba(61,255,143,0.3)] scale-95";
    return `${base} ${pressedBtn === 'SCAN' ? active : ''}`;
  };

  useEffect(() => {
    console.log('[SimScreen] Mounted');
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[SimScreen] Keydown event:', e.key);
      const s = store.getState();
      if (s.scanningActive || s.roverState === 'MOVING' || s.energy <= 5 || s.currentScreen !== 'sim') {
        console.log('[SimScreen] Input ignored due to state:', { scanningActive: s.scanningActive, roverState: s.roverState, energy: s.energy, currentScreen: s.currentScreen });
        return;
      }
      if (s.modals.node || s.modals.challenge || s.modals.result || s.modals.storm || s.modals.efail || s.modals.end) {
        console.log('[SimScreen] Input ignored due to open modal:', s.modals);
        return;
      }
      
      let dir = '';
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': dir = 'N'; break;
        case 'ArrowDown': case 's': case 'S': dir = 'S'; break;
        case 'ArrowLeft': case 'a': case 'A': dir = 'W'; break;
        case 'ArrowRight': case 'd': case 'D': dir = 'E'; break;
        case 'q': case 'Q': dir = 'NW'; break;
        case 'e': case 'E': dir = 'NE'; break;
        case 'z': case 'Z': dir = 'SW'; break;
        case 'c': case 'C': dir = 'SE'; break;
        case ' ': dir = 'SCAN'; break;
        case 'i': case 'I': camInput.current.tilt = -1; break;
        case 'k': case 'K': camInput.current.tilt = 1; break;
        case 'j': case 'J': camInput.current.pan = -1; break;
        case 'l': case 'L': camInput.current.pan = 1; break;
        case 'r': case 'R': resetCamera(); break;
      }

      if (dir) {
        setPressedBtn(dir);
        if (dir === 'SCAN') {
          console.log('[SimScreen] Scanning');
          doScan();
        } else {
          console.log(`[SimScreen] Moving ${dir}`);
          move(dir);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let dir = '';
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': dir = 'N'; break;
        case 'ArrowDown': case 's': case 'S': dir = 'S'; break;
        case 'ArrowLeft': case 'a': case 'A': dir = 'W'; break;
        case 'ArrowRight': case 'd': case 'D': dir = 'E'; break;
        case 'q': case 'Q': dir = 'NW'; break;
        case 'e': case 'E': dir = 'NE'; break;
        case 'z': case 'Z': dir = 'SW'; break;
        case 'c': case 'C': dir = 'SE'; break;
        case ' ': dir = 'SCAN'; break;
        case 'i': case 'I': if (camInput.current.tilt === -1) camInput.current.tilt = 0; break;
        case 'k': case 'K': if (camInput.current.tilt === 1) camInput.current.tilt = 0; break;
        case 'j': case 'J': if (camInput.current.pan === -1) camInput.current.pan = 0; break;
        case 'l': case 'L': if (camInput.current.pan === 1) camInput.current.pan = 0; break;
      }
      if (dir) {
        setPressedBtn(prev => prev === dir ? null : prev);
      }
    };

    const updateLoop = () => {
      const { pan: inPan, tilt: inTilt } = camInput.current;
      const { pan: vPan, tilt: vTilt } = camVelocity.current;

      // Apply acceleration
      let nextVPan = vPan + inPan * CAM_ACCEL;
      let nextVTilt = vTilt + inTilt * CAM_ACCEL;

      // Apply friction
      nextVPan *= CAM_FRICTION;
      nextVTilt *= CAM_FRICTION;

      // Cap speed
      if (Math.abs(nextVPan) > CAM_MAX_SPEED) nextVPan = Math.sign(nextVPan) * CAM_MAX_SPEED;
      if (Math.abs(nextVTilt) > CAM_MAX_SPEED) nextVTilt = Math.sign(nextVTilt) * CAM_MAX_SPEED;

      // Stop if very slow
      if (Math.abs(nextVPan) < 0.01) nextVPan = 0;
      if (Math.abs(nextVTilt) < 0.01) nextVTilt = 0;

      camVelocity.current = { pan: nextVPan, tilt: nextVTilt };

      if (nextVPan !== 0 || nextVTilt !== 0) {
        updateCamera(nextVPan, nextVTilt);
      }

      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      console.log('[SimScreen] Unmounted');
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const h = Math.floor(state.timeFrac * 24);
  const m2 = Math.floor((state.timeFrac * 24 - h) * 60);
  const solLine = `SOL ${state.solNumber} · ${h}:${String(m2).padStart(2, '0')} · ${(state.latencyMs / 1000).toFixed(1)}s RTT`;

  const tNames = ['', 'CADET', 'TECHNICIAN', 'ANALYST', 'SYS ENG', 'COMMANDER'];
  
  const e = Math.round(state.energy);
  const r = Math.round(state.risk);

  const nightActive = isNight() && !state.stormActive;

  return (
    <div id="screen-sim" className="screen active flex flex-col h-full pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#060608]">
      <div className="sim-topbar flex items-center justify-between py-2 px-3 border-b border-[#ffffff12] bg-[#111318] shrink-0 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="topbar-left flex gap-3.5 items-center shrink-0">
          <div className="stat-chip flex flex-col gap-[2px]">
            <div className="stat-chip-label font-mono text-[7px] text-[#6B6860] tracking-[2px] whitespace-nowrap">Energy</div>
            <div className="energy-bar flex items-center gap-1.5">
              <div className="ebar-track w-[40px] sm:w-[70px] h-1 bg-[#1a1a1a] border border-[#ffffff12]">
                <div className="ebar-fill h-full transition-all duration-600" style={{ width: `${e}%`, background: e < 15 ? 'var(--red)' : e < 35 ? 'var(--amber)' : 'var(--green)' }}></div>
              </div>
              <span className="stat-chip-val font-mono text-[12px] whitespace-nowrap" style={{ color: e < 15 ? 'var(--red)' : e < 35 ? 'var(--amber)' : 'var(--text)' }}>{e}%</span>
            </div>
          </div>
          <div className="stat-chip flex flex-col gap-[2px]">
            <div className="stat-chip-label font-mono text-[7px] text-[#6B6860] tracking-[2px] whitespace-nowrap">Risk Budget</div>
            <div className="energy-bar flex items-center gap-1.5">
              <div className="ebar-track w-[40px] sm:w-[70px] h-1 bg-[#1a1a1a] border border-[#ffffff12]">
                <div className="ebar-fill h-full transition-all duration-600" style={{ width: `${Math.min(100, r)}%`, background: r >= 70 ? 'var(--red)' : r >= 40 ? 'var(--amber)' : 'var(--green)' }}></div>
              </div>
              <span className="stat-chip-val font-mono text-[12px] whitespace-nowrap" style={{ color: r >= 70 ? 'var(--red)' : r >= 40 ? 'var(--amber)' : 'var(--green)' }}>{r}</span>
            </div>
          </div>
        </div>
        <div className="topbar-center text-center shrink-0 flex flex-col items-center">
          <div className="mission-badge font-display text-[18px] text-[#FF6B35] tracking-[2px] whitespace-nowrap">HEX-01</div>
          <div className="sol-line font-mono text-[9px] text-[#6B6860] whitespace-nowrap">{solLine}</div>
          {state.role && <div className="qa-sim-marker mt-1.5 font-mono text-[8px] tracking-[1.6px] text-[#3DFF8F] border border-[rgba(61,255,143,0.3)] bg-[rgba(61,255,143,0.08)] py-0.5 px-1.5 inline-flex items-center gap-1.25 whitespace-nowrap">● SIM STARTED · {state.role.toUpperCase()}</div>}
        </div>
        <div className="topbar-right flex justify-end items-center gap-2.5 shrink-0">
          <div className="tier-display flex items-center gap-1.5 font-mono text-[10px] text-[#FFB830] whitespace-nowrap">
            <span>T{state.tier}</span><span className="text-[#6B6860] whitespace-nowrap">{tNames[state.tier] || ''}</span>
          </div>
          <div className="stat-chip flex flex-col gap-[2px]">
            <div className="stat-chip-label font-mono text-[7px] text-[#6B6860] tracking-[2px] whitespace-nowrap">Valid.</div>
            <div className="flex gap-[2px] mt-[2px]">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="val-pip w-2 h-2 border rounded-[1px] shrink-0" style={{ background: i < state.validation ? 'var(--green)' : 'transparent', borderColor: i < state.validation ? 'var(--green)' : 'var(--green-dim)' }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes swipe-anim {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
        }
      `}</style>
      <div 
        ref={viewportRef}
        className="sim-viewport flex-1 relative overflow-hidden bg-[#030405] cursor-crosshair min-h-[200px] touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { touchStart.current = null; }}
      >
        <div className="sky absolute inset-0 bg-gradient-to-b from-[#060309] via-[#0D0810] to-[#2A1208] z-0"></div>
        <div className="stars absolute top-0 left-0 right-0 h-[60%] z-1"></div>
        <div className="horizon-glow absolute bottom-[35%] left-0 right-0 h-[80px] bg-gradient-to-b from-transparent to-[rgba(200,80,20,0.15)] z-2"></div>
        <div className="ground absolute bottom-0 left-0 right-0 h-[37%] bg-gradient-to-b from-[#1A0E06] to-[#0F0A04] z-3" style={{ clipPath: 'polygon(0% 25%,4% 10%,10% 22%,18% 5%,26% 18%,34% 3%,42% 16%,50% 2%,58% 15%,66% 4%,74% 18%,82% 6%,90% 20%,96% 8%,100% 18%,100% 100%,0% 100%)' }}></div>
        
        <div className="rocks absolute bottom-[35%] left-[-10%] right-[-10%] h-[80px] pointer-events-none transition-transform duration-300 z-4" style={{ transform: `translateX(${state.rocksOffset}px)` }}>
          <div className="rock absolute bg-[#160D05] rounded-t-full border-t border-[#241508]" style={{ width: '64px', height: '32px', left: '8%', bottom: 0 }}></div>
          <div className="rock absolute bg-[#160D05] rounded-t-full border-t border-[#241508]" style={{ width: '28px', height: '18px', left: '22%', bottom: 0 }}></div>
          <div className="rock absolute bg-[#160D05] rounded-t-full border-t border-[#241508]" style={{ width: '88px', height: '38px', left: '60%', bottom: 0 }}></div>
          <div className="rock absolute bg-[#160D05] rounded-t-full border-t border-[#241508]" style={{ width: '44px', height: '24px', left: '80%', bottom: 0 }}></div>
          <div className="rock absolute bg-[#160D05] rounded-t-full border-t border-[#241508]" style={{ width: '16px', height: '10px', left: '44%', bottom: 0 }}></div>
        </div>

        <div className={`rover-container absolute bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center z-8 ${state.roverState === 'MOVING' ? 'moving' : ''}`} style={{ animation: state.roverState === 'MOVING' ? 'shake 0.12s infinite' : 'idle-bob 4s ease-in-out infinite' }}>
          {/* Camera Mast */}
          <div className="rover-mast flex flex-col items-center mb-[-10px]" style={{ transform: `rotateY(${state.camPan}deg)` }}>
            <div className="cam-head w-[48px] h-[36px] bg-[#2A2A2A] rounded-t-[5px] rounded-b-[3px] border border-[#444] flex items-center justify-center relative" style={{ transform: `rotateX(${state.camTilt}deg)` }}>
              <div className="cam-lens w-[20px] h-[20px] rounded-full border-2 border-[#555]" style={{ background: 'radial-gradient(circle at 35% 35%, #0A2A4A, #030810)' }}>
                <div className="absolute top-[6px] left-[8px] w-[5px] h-[5px] rounded-full bg-[rgba(0,212,255,0.3)]"></div>
              </div>
              <div className="cam-eye absolute right-[7px] top-[7px] w-[6px] h-[6px] rounded-full bg-[#D64000] shadow-[0_0_8px_#D64000]" style={{ animation: 'eye-blink 5s infinite' }}></div>
            </div>
            <div className="mast-pole w-[6px] h-[60px] rounded-[3px] relative" style={{ background: 'linear-gradient(90deg,#222,#444,#222)' }}>
              <div className="absolute left-[-7px] top-[20px] right-[-7px] h-[2px] bg-[#333]"></div>
            </div>
          </div>

          {/* Dummy Rover Body */}
          <div className="rover-body-wrap flex flex-col items-center">
            <div className="chassis w-[100px] h-[35px] bg-[#1E1E1E] rounded-[8px] border border-[#333] relative shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              {/* Details on chassis */}
              <div className="absolute top-2 left-2 w-4 h-1 bg-[#D64000] opacity-50 rounded-full"></div>
              <div className="absolute top-2 right-2 w-4 h-1 bg-[#D64000] opacity-50 rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#333]"></div>
            </div>
            
            {/* Wheels */}
            <div className="wheels flex gap-8 mt-[-10px]">
              <div className="wheel w-[28px] h-[28px] bg-[#0A0A0A] rounded-full border-2 border-[#222] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="hub w-3 h-3 bg-[#1A1A1A] rounded-full border border-[#333]"></div>
              </div>
              <div className="wheel w-[28px] h-[28px] bg-[#0A0A0A] rounded-full border-2 border-[#222] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="hub w-3 h-3 bg-[#1A1A1A] rounded-full border border-[#333]"></div>
              </div>
              <div className="wheel w-[28px] h-[28px] bg-[#0A0A0A] rounded-full border-2 border-[#222] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="hub w-3 h-3 bg-[#1A1A1A] rounded-full border border-[#333]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="terrain-info absolute top-2.5 left-2.5 z-10 font-mono text-[9px] leading-loose text-[#6B6860] bg-[rgba(6,6,8,0.7)] py-2 px-3 border-l-2 border-[rgba(214,64,0,0.3)]">
          <div>TERRAIN: <span className="text-[#FF6B35]">{state.currentTerrain?.name || 'Basaltic Flats'}</span></div>
          <div>COMPLEX: <span className="text-[#FFB830]">{state.currentTerrain?.complex || '4.2'}</span></div>
          <div>QUADRANT: <span>{state.currentTerrain?.quadrant || 'A3-07'}</span></div>
          <div>DUST IDX: <span className="text-[#FFB830]">{state.dust.toFixed(3)}</span></div>
          <div>RISK: <span className="text-[#FF3B3B]">{Math.round(state.risk)}</span>/100</div>
          <div>PHASE: <span className={isNight() ? 'text-[#FFB830]' : 'text-[#3DFF8F]'}>{isNight() ? 'NIGHT' : 'DAY'} · {state.difficulty.toUpperCase()}</span></div>
          <div>XP: <span className="text-[#FF6B35]">{state.xp}</span></div>
        </div>

        <div className="risk-wrap absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-[3px]">
          <div className="risk-label font-mono text-[7px] text-[#6B6860] tracking-[2px]">RISK BUDGET</div>
          <div className="risk-track w-[90px] h-[5px] bg-[#1a0a0a] border border-[#3d1010]">
            <div className="risk-fill h-full transition-all duration-500" style={{ width: `${Math.min(100, r)}%`, background: r >= 70 ? 'var(--red)' : r >= 40 ? 'var(--amber)' : 'var(--green)' }}></div>
          </div>
          <div className="risk-pct font-mono text-[9px] text-[#FF3B3B]">{Math.min(100, r)}%</div>
        </div>

        <div className={`scan-overlay absolute inset-0 z-9 transition-opacity duration-300 pointer-events-none ${state.scanningActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="scan-beam absolute left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,var(--green),transparent)', animation: 'scan-sweep 1s linear infinite' }}></div>
          <div className="scan-corners">
            <span className="tl absolute w-[18px] h-[18px] border-[#3DFF8F] border-solid opacity-70 top-2 left-2 border-t border-l"></span>
            <span className="tr absolute w-[18px] h-[18px] border-[#3DFF8F] border-solid opacity-70 top-2 right-2 border-t border-r"></span>
            <span className="bl absolute w-[18px] h-[18px] border-[#3DFF8F] border-solid opacity-70 bottom-2 left-2 border-b border-l"></span>
            <span className="br absolute w-[18px] h-[18px] border-[#3DFF8F] border-solid opacity-70 bottom-2 right-2 border-b border-r"></span>
          </div>
        </div>

        {swipeIndicator && (
          <div 
            className="absolute z-50 pointer-events-none flex items-center justify-center text-[#FF6B35] font-bold text-4xl drop-shadow-[0_0_10px_rgba(255,107,53,0.8)]"
            style={{
              left: swipeIndicator.x,
              top: swipeIndicator.y,
              animation: 'swipe-anim 0.6s ease-out forwards',
            }}
          >
            {swipeIndicator.dir === 'N' ? '↑' :
             swipeIndicator.dir === 'S' ? '↓' :
             swipeIndicator.dir === 'E' ? '→' :
             swipeIndicator.dir === 'W' ? '←' :
             swipeIndicator.dir === 'NE' ? '↗' :
             swipeIndicator.dir === 'NW' ? '↖' :
             swipeIndicator.dir === 'SE' ? '↘' :
             swipeIndicator.dir === 'SW' ? '↙' : ''}
          </div>
        )}

        <div className={`night-layer absolute inset-0 z-5 pointer-events-none transition-colors duration-3000 ${nightActive ? 'bg-[rgba(0,5,20,0.5)]' : 'bg-[rgba(0,5,20,0)]'}`}></div>
        <div className={`storm-layer absolute inset-0 z-6 pointer-events-none transition-colors duration-1000 ${state.stormActive ? 'bg-[rgba(80,40,10,0.4)]' : 'bg-[rgba(80,40,10,0)]'}`}></div>
        <div className={`low-energy-ring absolute inset-0 z-7 border-3 border-[#FF3B3B] pointer-events-none ${e < 15 ? 'opacity-100' : 'opacity-0'}`} style={{ animation: 'ring-pulse 1s ease-in-out infinite' }}></div>
        <div className={`solar-ring absolute inset-0 z-4 border-2 border-transparent pointer-events-none transition-all duration-500 ${state.isCharging ? 'border-[rgba(255,184,48,0.2)] shadow-[inset_0_0_50px_rgba(255,184,48,0.06)]' : ''}`}></div>
      </div>

      <div className="sim-bottom flex flex-row border-t border-[#ffffff12] bg-[#111318] shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="cam-panel border-r border-[#ffffff12] py-2 px-2 flex flex-col gap-[2px] flex-1 min-w-[110px]">
          <div className="panel-lbl font-mono text-[7px] text-[#6B6860] tracking-[2px] border-b border-[#ffffff12] pb-1 mb-1 uppercase whitespace-nowrap">// TELEMETRY</div>
          <div className="cam-telem font-mono text-[8px] leading-tight flex flex-col gap-1">
            <div className="flex justify-between"><span className="text-[#6B6860]">TEMP</span><span className="text-[#A8A49C]">{(-70 + 40 * Math.sin(state.timeFrac * Math.PI * 2)).toFixed(1)}°C</span></div>
            <div className="flex justify-between"><span className="text-[#6B6860]">PRESS</span><span className="text-[#A8A49C]">0.636 kPa</span></div>
            <div className="flex justify-between"><span className="text-[#6B6860]">WIND</span><span className="text-[#A8A49C]">4.2 m/s</span></div>
            <div className="flex justify-between"><span className="text-[#6B6860]">RAD</span><span className="text-[#A8A49C]">0.18 mGy/d</span></div>
            <div className="flex justify-between"><span className="text-[#6B6860]">STATE</span><span className={state.roverState === 'IDLE' ? 'text-[#3DFF8F]' : 'text-[#FFB830]'}>{state.roverState}</span></div>
            <div className="flex justify-between"><span className="text-[#6B6860]">COOL</span><span className="text-[#FFB830]">{state.instrumentCooldown > 0 ? `${state.instrumentCooldown}s` : 'READY'}</span></div>
          </div>
          <div className="scan-sweep-line w-full h-[1px] opacity-50 mt-auto" style={{ background: 'linear-gradient(90deg,transparent,var(--green),transparent)', animation: 'sweep 3s linear infinite' }}></div>
        </div>
        
        <div className="cam-ctrls border-r border-[#ffffff12] py-2 px-2 flex flex-col items-center justify-center shrink-0 w-[100px]">
          <div className="font-mono text-[7px] text-[#6B6860] tracking-[1px] uppercase mb-2 whitespace-nowrap">// CAM PAN/TLT</div>
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            <div />
            <button className="w-7 h-7 bg-[#181B22] border border-[#ffffff12] text-[#6B6860] text-[10px] flex items-center justify-center active:bg-[#D64000] active:text-white select-none touch-none rounded-[2px]" onPointerDown={() => camInput.current.tilt = -1} onPointerUp={() => camInput.current.tilt = 0} onPointerLeave={() => camInput.current.tilt = 0}>↑</button>
            <div />
            <button className="w-7 h-7 bg-[#181B22] border border-[#ffffff12] text-[#6B6860] text-[10px] flex items-center justify-center active:bg-[#D64000] active:text-white select-none touch-none rounded-[2px]" onPointerDown={() => camInput.current.pan = -1} onPointerUp={() => camInput.current.pan = 0} onPointerLeave={() => camInput.current.pan = 0}>←</button>
            <button className="w-7 h-7 bg-[#181B22] border border-[#ffffff12] text-[#FFB830] text-[10px] flex items-center justify-center active:bg-[#D64000] active:text-white rounded-[2px]" onClick={() => resetCamera()}>•</button>
            <button className="w-7 h-7 bg-[#181B22] border border-[#ffffff12] text-[#6B6860] text-[10px] flex items-center justify-center active:bg-[#D64000] active:text-white select-none touch-none rounded-[2px]" onPointerDown={() => camInput.current.pan = 1} onPointerUp={() => camInput.current.pan = 0} onPointerLeave={() => camInput.current.pan = 0}>→</button>
            <div />
            <button className="w-7 h-7 bg-[#181B22] border border-[#ffffff12] text-[#6B6860] text-[10px] flex items-center justify-center active:bg-[#D64000] active:text-white select-none touch-none rounded-[2px]" onPointerDown={() => camInput.current.tilt = 1} onPointerUp={() => camInput.current.tilt = 0} onPointerLeave={() => camInput.current.tilt = 0}>↓</button>
            <div />
          </div>
          <div className="font-mono text-[7px] text-[#A8A49C] flex gap-2">
            <span>P:{Math.round(state.camPan)}°</span>
            <span>T:{Math.round(state.camTilt)}°</span>
          </div>
        </div>
        
        <div className="ctrl-panel py-2 px-2 flex flex-col items-center justify-center shrink-0 w-[120px] touch-none">
          <div className="font-mono text-[7px] text-[#6B6860] tracking-[1px] uppercase mb-2 whitespace-nowrap">// MOVEMENT</div>
          <div className="dir-grid grid grid-cols-[repeat(3,32px)] grid-rows-[repeat(3,32px)] gap-[3px]">
            {[
              { dir: 'NW', icon: '↖' },
              { dir: 'N', icon: '↑' },
              { dir: 'NE', icon: '↗' },
              { dir: 'W', icon: '←' },
              { dir: 'SCAN', icon: 'SCAN' },
              { dir: 'E', icon: '→' },
              { dir: 'SW', icon: '↙' },
              { dir: 'S', icon: '↓' },
              { dir: 'SE', icon: '↘' },
            ].map(btn => (
              <button
                key={btn.dir}
                className={btn.dir === 'SCAN' ? getScanBtnClass() : getBtnClass(btn.dir)}
                onPointerDown={() => setPressedBtn(btn.dir)}
                onPointerUp={() => setPressedBtn(null)}
                onPointerLeave={() => setPressedBtn(null)}
                onClick={() => {
                  console.log(`[SimScreen] Clicked ${btn.dir}`);
                  if (btn.dir === 'SCAN') doScan();
                  else move(btn.dir);
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
