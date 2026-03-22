import React from 'react';
import { useGameStore } from '../store';

export default function DarScreen() {
  const { darData } = useGameStore();

  if (!darData) {
    return (
      <div id="screen-dar" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full items-center justify-center">
        <div className="font-mono text-[12px] text-[#6B6860]">No Decision Analysis Report available yet.</div>
        <div className="font-mono text-[10px] text-[#A8A49C] mt-2">Complete a mission to generate a DAR.</div>
      </div>
    );
  }

  return (
    <div id="screen-dar" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full">
      <div className="page-topbar flex items-center justify-between gap-3 py-2.5 px-4 border-b border-[#ffffff12] bg-[#111318] shrink-0">
        <div className="page-title font-display text-[20px] text-[#E8E4DC] tracking-[2px]">DECISION ANALYSIS</div>
        <span className="pill mars">DAR</span>
      </div>
      
      <div className="dar-body flex-1 overflow-y-auto p-4 pb-24">
        <div className="dar-header mb-6 border-b border-[#ffffff12] pb-4">
          <div className="font-mono text-[10px] text-[#6B6860] tracking-[2px] mb-1">MISSION REPORT</div>
          <div className="font-display text-[28px] text-[#E8E4DC] leading-[1.1] mb-2">{darData.missionName}</div>
          <div className="flex gap-2">
            <span className={`pill ${darData.success ? 'green' : 'red'}`}>{darData.success ? 'SUCCESS' : 'FAILED'}</span>
            <span className="pill amber">Score: {darData.score}</span>
          </div>
        </div>
        
        <div className="dar-section mb-6">
          <div className="font-mono text-[12px] text-[#FF6B35] tracking-[1px] mb-3">PERFORMANCE METRICS</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="metric-box bg-[#111318] border border-[#ffffff12] p-3 rounded-[6px]">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">ENERGY EFFICIENCY</div>
              <div className="font-mono text-[16px] text-[#E8E4DC]">{darData.energyEfficiency}%</div>
            </div>
            <div className="metric-box bg-[#111318] border border-[#ffffff12] p-3 rounded-[6px]">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">RISK MANAGEMENT</div>
              <div className="font-mono text-[16px] text-[#E8E4DC]">{darData.riskManagement}%</div>
            </div>
            <div className="metric-box bg-[#111318] border border-[#ffffff12] p-3 rounded-[6px]">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">TIME UTILIZATION</div>
              <div className="font-mono text-[16px] text-[#E8E4DC]">{darData.timeUtilization}%</div>
            </div>
            <div className="metric-box bg-[#111318] border border-[#ffffff12] p-3 rounded-[6px]">
              <div className="font-mono text-[9px] text-[#6B6860] mb-1">DECISION QUALITY</div>
              <div className="font-mono text-[16px] text-[#E8E4DC]">{darData.decisionQuality}%</div>
            </div>
          </div>
        </div>
        
        <div className="dar-section mb-6">
          <div className="font-mono text-[12px] text-[#FF6B35] tracking-[1px] mb-3">AI ANALYSIS</div>
          <div className="bg-[#111318] border border-[#ffffff12] p-4 rounded-[6px]">
            <p className="text-[13px] text-[#A8A49C] leading-[1.6] mb-4">
              {darData.analysisText}
            </p>
            <div className="font-mono text-[10px] text-[#3DFF8F] tracking-[1px] mb-2">KEY STRENGTHS</div>
            <ul className="list-disc pl-4 text-[12px] text-[#E8E4DC] mb-4">
              {darData.strengths.map((s: string, i: number) => <li key={i} className="mb-1">{s}</li>)}
            </ul>
            <div className="font-mono text-[10px] text-[#FFB830] tracking-[1px] mb-2">AREAS FOR IMPROVEMENT</div>
            <ul className="list-disc pl-4 text-[12px] text-[#E8E4DC]">
              {darData.improvements.map((s: string, i: number) => <li key={i} className="mb-1">{s}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
