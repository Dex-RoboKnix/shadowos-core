import React, { useState } from 'react';
import { Calculator, ShieldAlert, List } from 'lucide-react';

const DexConsoleApp: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'abacus' | 'tripwire' | 'structuralist'>('abacus');
  
  // Abacus State
  const [tokenInput, setTokenInput] = useState('');
  const [cost, setCost] = useState(0);

  // Tripwire State
  const [scanText, setScanText] = useState('');
  const [aggressionScore, setAggressionScore] = useState(0);

  // Structuralist State
  const [bullets, setBullets] = useState('');
  const [formatted, setFormatted] = useState('');

  const calculateCost = () => {
    const tokens = parseInt(tokenInput) || 0;
    // Rough estimate: $0.0001 per 1k tokens (Flash-like)
    setCost((tokens / 1000) * 0.0001);
  };

  const scanAggression = () => {
    const triggers = ['stupid', 'idiot', 'useless', 'fail', 'hate'];
    let score = 0;
    triggers.forEach(t => {
      if (scanText.toLowerCase().includes(t)) score += 20;
    });
    setAggressionScore(Math.min(score, 100));
  };

  const formatBullets = () => {
    const lines = bullets.split('\n').filter(l => l.trim());
    const md = lines.map(l => `> - [ ] ${l.replace(/^- /, '')}`).join('\n');
    setFormatted(`/// DEPLOYMENT_LOG ///\n\n${md}\n\n[STATUS: PENDING]`);
  };

  return (
    <div className="flex h-full bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-black/5 flex flex-col items-center py-4 gap-4">
        <button 
          onClick={() => setActiveTool('abacus')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'abacus' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <Calculator size={20} />
        </button>
        <button 
          onClick={() => setActiveTool('tripwire')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'tripwire' ? 'bg-red-500 text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <ShieldAlert size={20} />
        </button>
        <button 
          onClick={() => setActiveTool('structuralist')}
          className={`p-3 rounded-xl transition-all ${activeTool === 'structuralist' ? 'bg-blue-500 text-white shadow-lg' : 'text-black/40 hover:bg-black/5'}`}
        >
          <List size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTool === 'abacus' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">The Abacus</h2>
            <p className="text-sm text-black/60">Token Cost Calculator</p>
            <input 
              type="number" 
              placeholder="Token Count" 
              className="w-full p-3 rounded-lg border border-black/10"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button onClick={calculateCost} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Calculate</button>
            <div className="text-2xl font-mono mt-4">${cost.toFixed(6)}</div>
          </div>
        )}

        {activeTool === 'tripwire' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-600">The Tripwire</h2>
            <p className="text-sm text-black/60">Aggression Scanner</p>
            <textarea 
              className="w-full h-32 p-3 rounded-lg border border-black/10 resize-none"
              placeholder="Draft text here..."
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
            />
            <button onClick={scanAggression} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Scan</button>
            <div className="mt-4">
              <div className="text-xs font-bold uppercase mb-1">Aggression Level</div>
              <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${aggressionScore > 50 ? 'bg-red-600' : 'bg-emerald-500'}`} 
                  style={{ width: `${aggressionScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTool === 'structuralist' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-600">The Structuralist</h2>
            <p className="text-sm text-black/60">Log Formatter</p>
            <textarea 
              className="w-full h-32 p-3 rounded-lg border border-black/10 resize-none font-mono text-xs"
              placeholder="- Item 1&#10;- Item 2"
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
            />
            <button onClick={formatBullets} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Format</button>
            {formatted && (
              <pre className="bg-black/5 p-4 rounded-lg text-xs overflow-auto h-32 select-all">
                {formatted}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DexConsoleApp;
