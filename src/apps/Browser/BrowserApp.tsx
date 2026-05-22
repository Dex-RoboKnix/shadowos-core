import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Lock } from 'lucide-react';

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) {
      target = `https://${target}`;
    }
    setUrl(target);
    setInputUrl(target);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full bg-white text-[#1d1d1f]">
      {/* Chrome UI / Address Bar */}
      <div className="h-10 bg-[#f5f5f7] flex items-center px-2 gap-2 border-b border-black/10">
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-black/5 rounded-full text-black/60 transition-colors">
            <ArrowLeft size={14} />
          </button>
          <button className="p-1.5 hover:bg-black/5 rounded-full text-black/60 transition-colors">
            <ArrowRight size={14} />
          </button>
          <button className="p-1.5 hover:bg-black/5 rounded-full text-black/60 transition-colors" onClick={() => setIsLoading(true)}>
            <RotateCcw size={14} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1">
          <div className="h-7 bg-white rounded-md border border-black/5 shadow-sm flex items-center px-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <Lock size={10} className="text-emerald-600" />
            <input 
              className="flex-1 bg-transparent border-none outline-none text-xs font-normal text-black/80"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="ShadowSurf"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIsLoading(false)}
        />
        
        {/* Overlay for blocked sites (Detection is hard in iframe, but we can warn user) */}
        <div className="absolute bottom-0 w-full bg-yellow-50 text-yellow-800 text-[10px] p-1 text-center border-t border-yellow-100">
          Note: Many sites (Google, GitHub) block embedding. Try Wikipedia, Bing, or simpler sites.
        </div>
      </div>
    </div>
  );
};

export default BrowserApp;
