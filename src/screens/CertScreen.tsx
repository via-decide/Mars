import React from 'react';
import { useGameStore } from '../store';

export default function CertScreen() {
  const { tier, badges, missionsCompleted } = useGameStore();

  const tNames = ['', 'CADET', 'TECHNICIAN', 'ANALYST', 'SYS ENG', 'COMMANDER'];
  const tierName = tNames[tier] || 'CADET';

  return (
    <div id="screen-cert" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full">
      <div className="page-topbar flex items-center justify-between gap-3 py-2.5 px-4 border-b border-[#ffffff12] bg-[#111318] shrink-0">
        <div className="page-title font-display text-[20px] text-[#E8E4DC] tracking-[2px]">CERTIFICATION</div>
        <span className="pill green">T{tier}</span>
      </div>
      
      <div className="cert-body flex-1 overflow-y-auto p-4 pb-24 flex flex-col items-center">
        <div className="cert-card w-full max-w-[400px] bg-[#111318] border border-[#ffffff12] rounded-[12px] p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D64000] via-[#FF6B35] to-[#D64000]"></div>
          
          <div className="text-center mb-6">
            <div className="font-mono text-[10px] text-[#6B6860] tracking-[3px] mb-2 uppercase">MARS DECISION LAB</div>
            <div className="font-display text-[36px] text-[#E8E4DC] leading-[1.1] mb-1">{tierName}</div>
            <div className="font-mono text-[12px] text-[#FFB830] tracking-[1px]">TIER {tier} CERTIFICATION</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="stat-box bg-[#060608] border border-[#ffffff12] p-3 rounded-[8px] text-center">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">MISSIONS</div>
              <div className="font-display text-[24px] text-[#3DFF8F]">{missionsCompleted.length}</div>
            </div>
            <div className="stat-box bg-[#060608] border border-[#ffffff12] p-3 rounded-[8px] text-center">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">BADGES</div>
              <div className="font-display text-[24px] text-[#FFB830]">{badges.length}</div>
            </div>
          </div>
          
          <div className="cert-details border-t border-[#ffffff12] pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-[#6B6860]">ID:</span>
              <span className="font-mono text-[10px] text-[#E8E4DC]">MDL-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-[#6B6860]">ISSUED:</span>
              <span className="font-mono text-[10px] text-[#E8E4DC]">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-[#6B6860]">STATUS:</span>
              <span className="font-mono text-[10px] text-[#3DFF8F]">ACTIVE</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-[rgba(214,64,0,0.15)] border border-[#D64000] text-[#FF6B35] py-2 px-6 rounded-[8px] font-mono text-[12px] tracking-[1px] hover:bg-[#D64000] hover:text-white transition-colors duration-200">
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
