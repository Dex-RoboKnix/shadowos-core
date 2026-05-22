import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const PayloadApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    const wrapper = `dex(human_input)<--yolo>
[
${input}
]`;
    const finalPayload = `${wrapper}

[🖕*0]`;
    
    navigator.clipboard.writeText(finalPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f7] p-6 text-[#1d1d1f]">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-1">Payload Launcher</h2>
        <p className="text-xs text-black/60">Ingest. Wrap. Deploy.</p>
      </div>
      
      <textarea
        className="flex-1 bg-white p-4 rounded-xl border border-black/5 shadow-sm resize-none outline-none font-mono text-xs leading-relaxed placeholder:text-black/20 mb-4"
        placeholder="Paste raw cognitive stream here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleProcess}
        className={`h-12 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
          copied 
            ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
            : 'bg-black text-white hover:bg-black/80 shadow-black/20'
        }`}
      >
        {copied ? (
          <>
            <Check size={16} />
            <span>Payload Copied</span>
          </>
        ) : (
          <>
            <ArrowRight size={16} />
            <span>Process & Copy</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PayloadApp;
