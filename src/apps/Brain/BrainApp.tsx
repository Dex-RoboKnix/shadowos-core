import React from 'react';
import { BrainCircuit } from 'lucide-react';

const BrainApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1c] text-white p-8 items-center justify-center">
      <div className="relative mb-8">
        <BrainCircuit size={64} className="text-emerald-400 animate-pulse" />
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight mb-2">Local Brain</h2>
      <p className="text-white/40 text-center max-w-xs mb-8">
        Offline Inference Engine<br/>
        (Llama-3-8B-Quantized)
      </p>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4 text-xs font-mono text-emerald-400">
          <span>STATUS: STANDBY</span>
          <span>WEBGPU: DETECTED</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2">
          <div className="w-0 h-full bg-emerald-500" />
        </div>
        <p className="text-[10px] text-white/30 text-center">Model not loaded. Click Initialize to fetch weights.</p>
      </div>

      <button className="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        INITIALIZE NEURAL LINK
      </button>
    </div>
  );
};

export default BrainApp;
