import React from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[500px] bg-[#f5f5f7] rounded-xl shadow-2xl overflow-hidden border border-white/50" onClick={e => e.stopPropagation()}>
        <div className="h-8 bg-white/50 flex items-center justify-between px-4 border-b border-black/5">
          <span className="text-[13px] font-medium text-black/60">About This System</span>
          <button onClick={onClose} className="hover:bg-black/5 rounded-full p-1 transition-colors">
            <X size={14} className="text-black/50" />
          </button>
        </div>
        
        <div className="p-8 flex gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-white rounded-full shadow-inner flex items-center justify-center border border-white/50">
              <span className="text-4xl font-bold text-black/20">S</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1d1d1f]">System</h1>
              <p className="text-sm text-black/50 font-medium">Version 1.0 (Null State)</p>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex gap-8">
                <span className="text-black/40 w-16 text-right">Chip</span>
                <span className="text-black/80 font-medium">Virtual Core v4.2</span>
              </div>
              <div className="flex gap-8">
                <span className="text-black/40 w-16 text-right">Memory</span>
                <span className="text-black/80 font-medium">Dynamic Allocation</span>
              </div>
              <div className="flex gap-8">
                <span className="text-black/40 w-16 text-right">Startup</span>
                <span className="text-black/80 font-medium">Shadow Disk</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button className="px-3 py-1 bg-white border border-black/10 rounded shadow-sm text-xs font-medium text-black/70 hover:bg-gray-50">System Report...</button>
              <button className="px-3 py-1 bg-white border border-black/10 rounded shadow-sm text-xs font-medium text-black/70 hover:bg-gray-50">Software Update...</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/30 px-4 py-2 text-[10px] text-black/30 text-center border-t border-black/5">
          ™ and © 2026 Null Corp. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
