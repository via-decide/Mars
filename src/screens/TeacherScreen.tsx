import React, { useState } from 'react';
import { TEACHER_STUDENTS, HEATMAP_DATA, BENCHMARK_DATA } from '../constants';

export default function TeacherScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div id="screen-teacher" className="screen active flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] bg-[#0D0E12] h-full">
      <div className="page-topbar flex items-center justify-between gap-3 py-2.5 px-4 border-b border-[#ffffff12] bg-[#111318] shrink-0">
        <div className="page-title font-display text-[20px] text-[#E8E4DC] tracking-[2px]">TEACHER DASHBOARD</div>
        <span className="pill amber">CLASS: PHY-101</span>
      </div>
      
      <div className="teacher-tabs flex border-b border-[#ffffff12] bg-[#111318] px-2">
        <button 
          className={`px-4 py-3 font-mono text-[11px] tracking-[1px] border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-[#6B6860] hover:text-[#A8A49C]'}`}
          onClick={() => setActiveTab('overview')}
        >
          OVERVIEW
        </button>
        <button 
          className={`px-4 py-3 font-mono text-[11px] tracking-[1px] border-b-2 transition-colors ${activeTab === 'students' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-[#6B6860] hover:text-[#A8A49C]'}`}
          onClick={() => setActiveTab('students')}
        >
          STUDENTS
        </button>
        <button 
          className={`px-4 py-3 font-mono text-[11px] tracking-[1px] border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-transparent text-[#6B6860] hover:text-[#A8A49C]'}`}
          onClick={() => setActiveTab('analytics')}
        >
          ANALYTICS
        </button>
      </div>
      
      <div className="teacher-body flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="stat-box bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px]">
                <div className="font-mono text-[10px] text-[#6B6860] mb-1">ACTIVE STUDENTS</div>
                <div className="font-display text-[32px] text-[#E8E4DC]">24<span className="text-[16px] text-[#6B6860]">/28</span></div>
              </div>
              <div className="stat-box bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px]">
                <div className="font-mono text-[10px] text-[#6B6860] mb-1">AVG COMPLETION</div>
                <div className="font-display text-[32px] text-[#3DFF8F]">68%</div>
              </div>
              <div className="stat-box bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px]">
                <div className="font-mono text-[10px] text-[#6B6860] mb-1">AVG SCORE</div>
                <div className="font-display text-[32px] text-[#FFB830]">842</div>
              </div>
              <div className="stat-box bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px]">
                <div className="font-mono text-[10px] text-[#6B6860] mb-1">ALERTS</div>
                <div className="font-display text-[32px] text-[#FF3B3B]">3</div>
              </div>
            </div>
            
            <div className="section-title font-mono text-[12px] text-[#FF6B35] tracking-[1px] mb-3">RECENT ACTIVITY</div>
            <div className="activity-list bg-[#111318] border border-[#ffffff12] rounded-[8px] overflow-hidden">
              {[
                { time: '10m ago', user: 'Alex Chen', action: 'Completed Mission 2', score: 920 },
                { time: '25m ago', user: 'Sarah Jones', action: 'Failed Mission 3 (Energy)', score: 0 },
                { time: '1h ago', user: 'Mike Smith', action: 'Earned "Risk Manager" Badge', score: null },
                { time: '2h ago', user: 'Emma Davis', action: 'Completed Mission 1', score: 850 },
              ].map((act, i) => (
                <div key={i} className="activity-item flex items-center justify-between p-3 border-b border-[#ffffff12] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-[#6B6860] w-12">{act.time}</span>
                    <div>
                      <div className="font-ui text-[13px] text-[#E8E4DC]">{act.user}</div>
                      <div className="font-mono text-[10px] text-[#A8A49C]">{act.action}</div>
                    </div>
                  </div>
                  {act.score !== null && <span className={`font-mono text-[12px] ${act.score > 0 ? 'text-[#3DFF8F]' : 'text-[#FF3B3B]'}`}>{act.score}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="tab-content">
            <div className="student-list flex flex-col gap-2">
              {TEACHER_STUDENTS.map((student, idx) => (
                <div key={idx} className="student-card bg-[#111318] border border-[#ffffff12] p-3 rounded-[8px] flex items-center justify-between">
                  <div>
                    <div className="font-ui font-bold text-[14px] text-[#E8E4DC]">{student.name}</div>
                    <div className="font-mono text-[10px] text-[#6B6860]">Tier {student.tier} • {student.acc}% Accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[14px] text-[#FFB830]">{student.si} SI</div>
                    <div className={`font-mono text-[9px] ${student.status === 'ACTIVE' ? 'text-[#3DFF8F]' : student.status === 'DEPLETED' ? 'text-[#FF3B3B]' : 'text-[#6B6860]'}`}>
                      {student.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="section-title font-mono text-[12px] text-[#FF6B35] tracking-[1px] mb-3">DECISION HEATMAP (MISSION 1)</div>
            <div className="bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px] mb-6">
              <div className="heatmap-grid grid grid-cols-6 gap-1 mb-3">
                {HEATMAP_DATA.flat().map((val, i) => (
                  <div 
                    key={i} 
                    className="h-8 rounded-[2px]" 
                    style={{ backgroundColor: `rgba(214, 64, 0, ${val / 100})` }}
                    title={`Zone ${i + 1}: ${val}% activity`}
                  ></div>
                ))}
              </div>
              <div className="font-mono text-[10px] text-[#A8A49C] leading-[1.5]">
                Most students are spending excess energy in the northern quadrants. Consider reviewing pathfinding strategies.
              </div>
            </div>
            
            <div className="section-title font-mono text-[12px] text-[#FF6B35] tracking-[1px] mb-3">CLASS BENCHMARKS</div>
            <div className="bg-[#111318] border border-[#ffffff12] p-4 rounded-[8px]">
              {BENCHMARK_DATA.map((bm, i) => (
                <div key={i} className="benchmark-item mb-4 last:mb-0">
                  <div className="flex justify-between font-mono text-[10px] mb-1">
                    <span className="text-[#E8E4DC]">{bm.name}</span>
                    <span className="text-[#6B6860]">Class: {bm.class} | Global: {bm.national}</span>
                  </div>
                  <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-[#3DFF8F] opacity-30" style={{ width: `${(bm.national / 100) * 100}%` }}></div>
                    <div className="absolute top-0 bottom-0 left-0 bg-[#FF6B35]" style={{ width: `${(bm.class / 100) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
