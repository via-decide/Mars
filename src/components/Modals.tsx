import React from 'react';
import { useGameStore, closeModal, setScreen } from '../store';
import { evaluateAnswer, showResult } from '../engine';

export default function Modals() {
  const state = useGameStore();

  return (
    <>
      {state.modals.node && (
        <div id="modal-node" className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-[4px]">
          <div className="modal-content w-full max-w-[400px] bg-[#111318] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="modal-header flex justify-between items-center mb-4 border-b border-[#ffffff12] pb-3">
              <h3 className="font-display text-[20px] text-[#E8E4DC] m-0">SCAN RESULTS</h3>
              <button className="text-[#6B6860] hover:text-[#E8E4DC] text-[20px] leading-none" onClick={() => closeModal('node')}>×</button>
            </div>
            <div className="modal-body font-mono text-[12px] text-[#A8A49C] leading-[1.6]">
              {state.scanResultText || "No data available."}
            </div>
            <div className="modal-footer mt-5 flex justify-end">
              <button className="bg-[rgba(61,255,143,0.1)] border border-[#3DFF8F] text-[#3DFF8F] py-1.5 px-4 rounded-[6px] font-mono text-[10px] tracking-[1px] hover:bg-[#3DFF8F] hover:text-[#000] transition-colors" onClick={() => closeModal('node')}>ACKNOWLEDGE</button>
            </div>
          </div>
        </div>
      )}

      {state.modals.challenge && state.currentChallenge && (
        <div id="modal-challenge" className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-[4px]">
          <div className="modal-content w-full max-w-[400px] bg-[#111318] border border-[rgba(214,64,0,0.3)] rounded-[12px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="modal-header flex justify-between items-center mb-4 border-b border-[#ffffff12] pb-3">
              <h3 className="font-display text-[20px] text-[#FF6B35] m-0">CRITICAL DECISION</h3>
            </div>
            <div className="modal-body">
              <p className="font-ui text-[14px] text-[#E8E4DC] leading-[1.6] mb-5">
                {state.currentChallenge.text}
              </p>
              <div className="challenge-options flex flex-col gap-2.5">
                {state.currentChallenge.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="text-left bg-[#060608] border border-[#ffffff12] p-3 rounded-[6px] font-mono text-[11px] text-[#A8A49C] hover:border-[#FF6B35] hover:text-[#E8E4DC] transition-colors"
                    onClick={() => evaluateAnswer(i)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {state.modals.result && (
        <div id="modal-result" className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-[4px]">
          <div className="modal-content w-full max-w-[400px] bg-[#111318] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="modal-header flex justify-between items-center mb-4 border-b border-[#ffffff12] pb-3">
              <h3 className="font-display text-[20px] text-[#E8E4DC] m-0">OUTCOME</h3>
            </div>
            <div className="modal-body font-mono text-[12px] text-[#A8A49C] leading-[1.6]">
              {state.resultText}
            </div>
            <div className="modal-footer mt-5 flex justify-end">
              <button className="bg-[rgba(61,255,143,0.1)] border border-[#3DFF8F] text-[#3DFF8F] py-1.5 px-4 rounded-[6px] font-mono text-[10px] tracking-[1px] hover:bg-[#3DFF8F] hover:text-[#000] transition-colors" onClick={() => closeModal('result')}>CONTINUE</button>
            </div>
          </div>
        </div>
      )}

      {state.modals.end && (
        <div id="modal-end" className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-[4px]">
          <div className="modal-content w-full max-w-[400px] bg-[#111318] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
            <div className="modal-header mb-4">
              <h3 className="font-display text-[28px] text-[#E8E4DC] m-0">{state.endTitle}</h3>
            </div>
            <div className="modal-body font-mono text-[13px] text-[#A8A49C] leading-[1.6] mb-6">
              {state.endDesc}
            </div>
            <div className="modal-footer flex flex-col gap-3">
              <button className="bg-[#D64000] text-white py-2.5 px-4 rounded-[6px] font-mono text-[12px] tracking-[1px] hover:bg-[#FF6B35] transition-colors" onClick={() => {
                closeModal('end');
                setScreen('dar');
              }}>
                VIEW ANALYSIS REPORT
              </button>
              <button className="bg-transparent border border-[#ffffff12] text-[#6B6860] py-2 px-4 rounded-[6px] font-mono text-[10px] tracking-[1px] hover:text-[#A8A49C] transition-colors" onClick={() => {
                closeModal('end');
                setScreen('missions');
              }}>
                RETURN TO MISSIONS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
