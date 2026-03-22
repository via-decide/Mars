import React from 'react';
import { useGameStore } from '../store';
import { SKILL_BRANCHES } from '../constants';

export default function SkillsScreen() {
  const { xp, skillNodes, badges } = useGameStore();

  return (
    <div id="screen-skills" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full">
      <div className="page-topbar flex items-center justify-between gap-3 py-2.5 px-4 border-b border-[#ffffff12] bg-[#111318] shrink-0">
        <div className="page-title font-display text-[20px] text-[#E8E4DC] tracking-[2px]">SKILL TREE</div>
        <span className="pill green">{xp} XP</span>
      </div>
      
      <div className="skills-body flex-1 overflow-y-auto py-5 px-4 pb-24">
        {SKILL_BRANCHES.map(branch => {
          const unlockedCount = branch.nodes.filter(n => skillNodes[n.id]).length;
          
          return (
            <div key={branch.id} className="skill-branch mb-6">
              <div className="branch-header flex items-center gap-2.5 mb-3">
                <span className="branch-icon text-[20px]">{branch.icon}</span>
                <span className="branch-name font-ui font-bold text-[14px] text-[#E8E4DC]">{branch.name}</span>
                <span className="branch-progress font-mono text-[9px] text-[#6B6860] ml-auto">{unlockedCount}/{branch.nodes.length} UNLOCKED</span>
              </div>
              <div className="branch-track flex gap-1.5 overflow-x-auto pb-1">
                {branch.nodes.map((node, i) => {
                  const isActive = skillNodes[node.id];
                  const prevUnlocked = i === 0 || skillNodes[branch.nodes[i - 1].id];
                  
                  return (
                    <React.Fragment key={node.id}>
                      {i > 0 && (
                        <div className={`skill-connector w-5 h-[2px] shrink-0 self-center mt-[-20px] ${isActive ? 'bg-[#1A4D35]' : 'bg-[#ffffff12]'}`}></div>
                      )}
                      <div className={`skill-node min-w-[130px] p-3 border shrink-0 relative transition-all duration-200 ${isActive ? 'active border-[#3DFF8F] shadow-[0_0_16px_rgba(61,255,143,0.15)] bg-[#111318]' : prevUnlocked ? 'unlocked border-[#1A4D35] bg-[rgba(61,255,143,0.04)]' : 'locked opacity-40 cursor-default border-[#ffffff12] bg-[#111318]'}`}>
                        <div className="skill-node-badge absolute top-1.5 right-1.5 text-[12px]">{isActive ? '✅' : prevUnlocked ? '🔓' : '🔒'}</div>
                        <div className="skill-node-name font-mono text-[10px] text-[#E8E4DC] mb-1">{node.name}</div>
                        <div className="skill-node-req text-[9px] text-[#6B6860] leading-[1.5]">{node.req}</div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-5 pt-4 border-t border-[#ffffff12]">
          <div className="font-mono text-[8px] text-[#6B6860] tracking-[2px] mb-2.5">BADGES EARNED ({badges.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {badges.length === 0 ? (
              <div className="font-mono text-[9px] text-[#6B6860]">No badges earned yet. Complete missions to earn badges.</div>
            ) : (
              badges.map(b => (
                <span key={b} className="pill amber">🏅 {b}</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
