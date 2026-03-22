import React, { useState } from 'react';
import { useGameStore, setScreen } from '../store';
import { enterAs } from '../engine';

export default function LandingScreen() {
  const { difficulty } = useGameStore();
  const [demoCode, setDemoCode] = useState('');
  const [demoError, setDemoError] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const handleRoleClick = (role: string) => {
    if (role === 'demo') {
      setPendingRole(role);
      setShowDemoModal(true);
    } else {
      enterAs(role);
    }
  };

  const handleDemoUnlock = () => {
    if (!demoCode.trim()) {
      setDemoError('Please enter your access code.');
      return;
    }
    // Simulate auth
    if (demoCode.toUpperCase() === 'MARS200') {
      setShowDemoModal(false);
      enterAs(pendingRole || 'demo');
    } else {
      setDemoError("That code didn't match. If you need access, email us and we'll send a working code.");
    }
  };

  return (
    <div id="screen-landing" className="screen active overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top,0px)] pb-[calc(env(safe-area-inset-bottom,0px)+8px)] h-full relative">
      <div className="bg-grid absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(214,64,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(214,64,0,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', animation: 'gridDrift 20s linear infinite' }}></div>
      <div className="bg-glow absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(214,64,0,0.12) 0%, transparent 60%)' }}></div>
      <div className="mars-sphere absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full z-1" style={{ background: 'radial-gradient(circle at 35% 30%, #8B3A1A 0%, #5A1E08 35%, #2A0C02 70%, #0A0401 100%)', boxShadow: '0 0 120px rgba(214,64,0,0.25), inset -60px -60px 100px rgba(0,0,0,0.7)' }}>
        <div className="absolute top-[15%] left-[10%] w-[35%] h-[25%] rounded-full blur-[20px]" style={{ background: 'rgba(180,80,20,0.2)' }}></div>
        <div className="absolute inset-[-2px] rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, transparent 60%, rgba(0,0,0,0.85) 100%)' }}></div>
      </div>
      
      <div className="landing-content relative z-10 flex flex-col items-center justify-center min-h-full px-5 py-6 pb-10">
        <div className="landing-eyebrow font-mono text-[10px] tracking-[4px] text-[#FF6B35] mb-4 opacity-0" style={{ animation: 'rise 0.6s 0.3s forwards' }}>◈ CONSTRAINT LEARNING ENGINE · V2.0</div>
        <div className="landing-title font-display text-[clamp(52px,10vw,110px)] text-[#E8E4DC] leading-[0.9] text-center mb-2 opacity-0" style={{ animation: 'rise 0.7s 0.6s forwards' }}>
          MARS<br/><em className="text-[#D64000] not-italic">DECISION</em><br/>LAB
        </div>
        <div className="landing-subtitle font-mono text-[clamp(9px,1.5vw,12px)] text-[#6B6860] tracking-[3px] text-center mb-12 uppercase opacity-0" style={{ animation: 'rise 0.6s 0.9s forwards' }}>Geological Survey Mission HEX-01 · Sol 127</div>
        <div className="landing-tagline max-w-[520px] text-center text-[14px] text-[#A8A49C] leading-[1.7] mb-12 opacity-0" style={{ animation: 'rise 0.6s 1.2s forwards' }}>
          A structured cognitive training system for STEM education.<br/>
          Make real decisions under real constraints. Learn systems thinking through survival.
        </div>
        
        <div className="flex justify-center mb-3 relative z-10 opacity-0" style={{ animation: 'rise 0.6s 1.3s forwards' }}>
          <label htmlFor="difficulty-select" className="font-mono text-[9px] tracking-[1.5px] text-[#6B6860] mr-2 self-center">DIFFICULTY</label>
          <select id="difficulty-select" className="bg-[#111318] text-[#E8E4DC] border border-[rgba(214,64,0,0.3)] py-1.5 px-2.5 font-mono text-[10px]" defaultValue={difficulty}>
            <option value="cadet">Cadet</option>
            <option value="analyst">Analyst</option>
            <option value="commander">Commander</option>
          </select>
        </div>
        
        <div className="role-cards flex gap-3 flex-wrap justify-center relative z-10 pb-3 opacity-0" style={{ animation: 'rise 0.6s 1.5s forwards' }}>
          <div className="role-card w-[180px] p-5 px-4 border border-[#ffffff12] bg-[#111318] cursor-pointer transition-all duration-250 text-center relative overflow-hidden group hover:border-[rgba(214,64,0,0.3)] hover:-translate-y-[3px]" onClick={() => handleRoleClick('student')}>
            <div className="absolute inset-0 bg-[#D64000] scale-y-0 origin-bottom transition-transform duration-250 opacity-[0.08] group-hover:scale-y-100"></div>
            <span className="role-icon text-[28px] mb-2.5 block transition-colors duration-200 group-hover:text-[#FF6B35]">🚀</span>
            <div className="role-name font-ui font-bold text-[14px] text-[#E8E4DC] mb-1.5">Student</div>
            <div className="role-desc text-[11px] text-[#6B6860] leading-[1.5]">Navigate missions, earn certifications, train your decision architecture</div>
            <div className="role-cta mt-2.5 inline-flex items-center justify-center py-1.5 px-2.5 border border-[rgba(214,64,0,0.3)] rounded-lg font-mono text-[10px] tracking-[0.08em] text-[#6B6860] bg-[rgba(255,255,255,0.02)] group-active:border-[#FF6B35] group-active:text-[#E8E4DC]">Launch Student Mode</div>
            <div className="role-badge absolute top-2 right-2"><span className="pill green">Start Free</span></div>
          </div>
          
          <div className="role-card w-[180px] p-5 px-4 border border-[#ffffff12] bg-[#111318] cursor-pointer transition-all duration-250 text-center relative overflow-hidden group hover:border-[rgba(214,64,0,0.3)] hover:-translate-y-[3px]" onClick={() => handleRoleClick('teacher')}>
            <div className="absolute inset-0 bg-[#D64000] scale-y-0 origin-bottom transition-transform duration-250 opacity-[0.08] group-hover:scale-y-100"></div>
            <span className="role-icon text-[28px] mb-2.5 block transition-colors duration-200 group-hover:text-[#FF6B35]">📊</span>
            <div className="role-name font-ui font-bold text-[14px] text-[#E8E4DC] mb-1.5">Teacher</div>
            <div className="role-desc text-[11px] text-[#6B6860] leading-[1.5]">Dashboard, class analytics, heatmaps, benchmark comparisons</div>
            <div className="role-cta mt-2.5 inline-flex items-center justify-center py-1.5 px-2.5 border border-[rgba(214,64,0,0.3)] rounded-lg font-mono text-[10px] tracking-[0.08em] text-[#6B6860] bg-[rgba(255,255,255,0.02)] group-active:border-[#FF6B35] group-active:text-[#E8E4DC]">Launch Teacher Mode</div>
            <div className="role-badge absolute top-2 right-2"><span className="pill amber">Dashboard</span></div>
          </div>
          
          <div className="role-card w-[180px] p-5 px-4 border border-[#ffffff12] bg-[#111318] cursor-pointer transition-all duration-250 text-center relative overflow-hidden group hover:border-[rgba(214,64,0,0.3)] hover:-translate-y-[3px]" onClick={() => handleRoleClick('demo')}>
            <div className="absolute inset-0 bg-[#D64000] scale-y-0 origin-bottom transition-transform duration-250 opacity-[0.08] group-hover:scale-y-100"></div>
            <span className="role-icon text-[28px] mb-2.5 block transition-colors duration-200 group-hover:text-[#FF6B35]">⚡</span>
            <div className="role-name font-ui font-bold text-[14px] text-[#E8E4DC] mb-1.5">Quick Demo</div>
            <div className="role-desc text-[11px] text-[#6B6860] leading-[1.5]">Jump straight into an active mission — no setup required</div>
            <div className="role-cta mt-2.5 inline-flex items-center justify-center py-1.5 px-2.5 border border-[rgba(214,64,0,0.3)] rounded-lg font-mono text-[10px] tracking-[0.08em] text-[#6B6860] bg-[rgba(255,255,255,0.02)] group-active:border-[#FF6B35] group-active:text-[#E8E4DC]">Launch Quick Demo</div>
            <div className="role-badge absolute top-2 right-2"><span className="pill mars">Try Now</span></div>
          </div>
        </div>
      </div>

      {showDemoModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-[18px] bg-[rgba(0,0,0,0.78)] backdrop-blur-[8px]">
          <div className="w-[min(440px,100%)] bg-[#111318] border border-[rgba(255,255,255,0.12)] rounded-[18px] p-[18px] shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
            <div className="inline-block font-mono text-[0.62rem] tracking-[1.5px] uppercase py-1.5 px-2.5 rounded-full border border-[rgba(61,255,143,0.35)] text-[#3DFF8F] bg-[rgba(61,255,143,0.08)] mb-2.5">DEMO ACCESS</div>
            <div className="font-ui font-extrabold text-[1.25rem] m-0 mb-2 text-[#FF6B35]">Unlock the Quick Demo</div>
            <div className="text-[rgba(232,228,220,0.85)] text-[0.92rem] leading-[1.7] m-0 mb-3.5">
              This is a prototype build — <b>no payments</b> and <b>no real accounts</b>.<br/>
              Enter the demo code to start instantly.
            </div>
            <input 
              className="w-full bg-[rgba(0,0,0,0.22)] border border-[rgba(255,255,255,0.14)] text-white py-3 px-3.5 rounded-xl outline-none text-[0.95rem]" 
              placeholder="Enter demo code (example: MARS200)" 
              value={demoCode}
              onChange={e => setDemoCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDemoUnlock()}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button className="border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] text-white rounded-xl py-2.5 px-3 cursor-pointer font-extrabold font-mono text-[0.72rem] tracking-[1px] uppercase" onClick={() => setShowDemoModal(false)}>Cancel</button>
              <button className="border border-[rgba(214,64,0,0.55)] bg-[rgba(214,64,0,0.16)] text-[#FF6B35] rounded-xl py-2.5 px-3 cursor-pointer font-extrabold font-mono text-[0.72rem] tracking-[1px] uppercase" onClick={handleDemoUnlock}>Unlock →</button>
            </div>
            {demoError && <div className="mt-2.5 text-[#f87171] text-[0.92rem] leading-[1.4]">{demoError}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
