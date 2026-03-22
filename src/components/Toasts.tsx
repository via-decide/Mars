import React from 'react';
import { useGameStore } from '../store';

export default function Toasts() {
  const { toasts } = useGameStore();

  return (
    <div id="toast-wrap" className="fixed bottom-[195px] left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-1 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="toast-item bg-[#181B22] border border-[#ffffff12] text-[#E8E4DC] font-mono text-[9px] tracking-[1px] py-1.5 px-4 uppercase whitespace-nowrap" style={{ animation: 'toast-anim 3s forwards' }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
