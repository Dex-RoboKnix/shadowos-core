import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useDragControls } from 'framer-motion';
import TerminalApp from './apps/Terminal/TerminalApp';
import PayloadApp from './apps/Payload/PayloadApp';
import DexConsoleApp from './apps/DexConsole/DexConsoleApp';
import BrainApp from './apps/Brain/BrainApp';
import FinderApp from './apps/Finder/FinderApp';
import BrowserApp from './apps/Browser/BrowserApp';
import AboutModal from './components/AboutModal';
import ScreenSaver from './components/ScreenSaver';
import { useFileSystemStore } from './stores/fileSystem';
import { 
  FileText, 
  Terminal as TerminalIcon, 
  Settings as SettingsIcon, 
  Search, 
  Cpu, 
  Wifi, 
  Battery, 
  Save, 
  X,
  Maximize2,
  Send,
  Cpu as Chip,
  Brain,
  Folder,
  Smile,
  Globe
} from 'lucide-react';
import { useOSStore } from './store';
import type { WindowState } from './store';

// --- Error Boundary ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- Components ---

const TopBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { virtualRAM, garbageCollect, openWindow, closeWindow, minimizeWindow, maximizeWindow, activeWindowId } = useOSStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSleep, setShowSleep] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const closeMenu = () => { setActiveMenu(null); setShowControlCenter(false); };
    window.addEventListener('click', closeMenu);
    return () => {
      clearInterval(timer);
      window.removeEventListener('click', closeMenu);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent, menu: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
    setShowControlCenter(false);
  };

  const toggleControlCenter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControlCenter(!showControlCenter);
    setActiveMenu(null);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'About This System':
        setShowAbout(true);
        break;
      case 'Sleep':
        setShowSleep(true);
        break;
      case 'Restart...':
        window.location.reload();
        break;
      case 'Shut Down...':
        // In a real app we might close the window, here we just simulate
        alert('System is shutting down...');
        window.close(); // May not work in all contexts but worth a try for PWA/Pop-up
        break;
      case 'New Window':
        // Default to opening Notes as "New Window"
        openWindow(`note-${Date.now()}`, 'Notes', <NotesApp />);
        break;
      case 'Close Window':
        if (activeWindowId) closeWindow(activeWindowId);
        break;
      case 'Enter Full Screen':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
        break;
      case 'Minimize':
        if (activeWindowId) minimizeWindow(activeWindowId);
        break;
      case 'Zoom':
        if (activeWindowId) maximizeWindow(activeWindowId);
        break;
      default:
        console.log(`Action: ${action}`);
    }
    setActiveMenu(null);
  };

  const menuItems: Record<string, string[]> = {
    'apple': ['About This System', 'System Settings...', 'Sleep', 'Restart...', 'Shut Down...'],
    'Finder': ['About Finder', 'Preferences...', 'Empty Trash', 'Hide Finder'],
    'File': ['New Window', 'New Folder', 'Open...', 'Close Window'],
    'Edit': ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All'],
    'View': ['Icons', 'List', 'Columns', 'Gallery', 'Enter Full Screen'],
    'Go': ['Back', 'Forward', 'Enclosing Folder', 'Home', 'Applications', 'Utilities'],
    'Window': ['Minimize', 'Zoom', 'Cycle Through Windows', 'Bring All to Front']
  };

  return (
    <>
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <ScreenSaver active={showSleep} onWake={() => setShowSleep(false)} />
      
      <div className="absolute top-0 w-full h-8 flex items-center justify-between px-5 z-[3000] text-[#1d1d1f] border-b border-black/[0.03] select-none bg-[#f5f5f7]/95" style={{willChange: 'transform', transform: 'translateZ(0)'}}>
      <div className="flex items-center gap-5 text-[13px] font-medium tracking-tight h-full">
        <div 
          className={`flex items-center gap-1.5 cursor-pointer px-2 py-0.5 rounded transition-colors font-bold text-[15px] relative ${activeMenu === 'apple' ? 'bg-black/10' : 'hover:bg-black/5'}`}
          onClick={(e) => toggleMenu(e, 'apple')}
        >
          <span></span>
          {activeMenu === 'apple' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 rounded-lg shadow-xl border border-black/5 py-1 flex flex-col z-[3001]">
              {menuItems['apple'].map((item) => (
                <div key={item} onClick={() => handleMenuAction(item)} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px] font-normal mx-1 rounded">{item}</div>
              ))}
            </div>
          )}
        </div>
        {['Finder', 'File', 'Edit', 'View', 'Go', 'Window'].map((menu) => (
          <div 
            key={menu}
            className={`cursor-pointer px-2 py-0.5 rounded transition-colors relative ${menu === 'Finder' ? 'font-semibold' : 'opacity-90'} ${activeMenu === menu ? 'bg-black/10' : 'hover:bg-black/5'}`}
            onClick={(e) => toggleMenu(e, menu)}
          >
            {menu}
            {activeMenu === menu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 rounded-lg shadow-xl border border-black/5 py-1 flex flex-col z-[3001]">
                {menuItems[menu].map((item) => (
                  <div key={item} onClick={() => handleMenuAction(item)} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px] font-normal mx-1 rounded">{item}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-5 text-[12px] font-medium tracking-wide">
        <div 
          className="flex items-center gap-2 px-2 py-0.5 hover:bg-black/5 rounded transition-colors cursor-pointer group"
          onClick={garbageCollect}
        >
          <Cpu size={14} className={virtualRAM > 80 ? "text-red-500 animate-pulse" : "text-black/30"} />
          <div className="w-12 h-1 bg-black/5 rounded-full overflow-hidden border border-black/5">
            <motion.div 
              className={`h-full ${virtualRAM > 80 ? 'bg-red-500' : 'bg-black/20'}`}
              animate={{ width: `${virtualRAM}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-black/60" onClick={toggleControlCenter}>
            <Wifi size={16} className="cursor-pointer hover:text-black transition-colors" />
            <Battery size={18} className="cursor-pointer hover:text-black transition-colors" />
            <Search size={16} className="cursor-pointer hover:text-black transition-colors" />
        </div>
        <span className="tabular-nums font-semibold text-black/80">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
        {showControlCenter && (
          <div className="absolute top-9 right-2 w-80 bg-white/95 rounded-2xl shadow-2xl border border-white/20 p-4 z-[3001] flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/50 rounded-xl p-3 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><Wifi size={16} /></div>
                  <div className="text-xs font-medium">Wi-Fi<div className="text-[10px] text-black/50">Home</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"><span className="font-bold text-[10px]">BT</span></div>
                  <div className="text-xs font-medium">Bluetooth<div className="text-[10px] text-black/50">On</div></div>
                </div>
              </div>
              <div className="flex-1 bg-white/50 rounded-xl p-3 flex flex-col gap-2 shadow-sm justify-center">
                 <div className="text-xs font-bold text-black/40 uppercase tracking-widest text-center">Do Not Disturb</div>
              </div>
            </div>
            <div className="bg-white/50 rounded-xl p-3 shadow-sm">
              <div className="text-xs font-medium mb-2">Display</div>
              <div className="h-6 bg-black/10 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-white shadow-sm rounded-full"></div>
              </div>
            </div>
            <div className="bg-white/50 rounded-xl p-3 shadow-sm">
              <div className="text-xs font-medium mb-2">Sound</div>
              <div className="h-6 bg-black/10 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-white shadow-sm rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

const Window: React.FC<WindowState> = ({ id, title, zIndex, x, y, width, height, content, isMaximized, isSplitView, isCentered }) => {
  const { closeWindow, maximizeWindow, toggleSplitView, toggleCenter, focusWindow, activeWindowId } = useOSStore();
  const isActive = activeWindowId === id;
  const dragControls = useDragControls();

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0, filter: "blur(10px)" }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        filter: "blur(0px)",
        width: isMaximized ? '100%' : (isSplitView ? '60%' : (isCentered ? '85%' : width)),
        height: isMaximized || isSplitView || isCentered ? 'calc(100% - 32px)' : height,
        top: isMaximized || isSplitView || isCentered ? 32 : y,
        left: isMaximized ? 0 : (isSplitView ? 0 : (isCentered ? '7.5%' : x)),
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      exit={{ scale: 0.96, opacity: 0, filter: "blur(10px)" }}
      style={{ zIndex }}
      className={`absolute rounded-xl overflow-hidden flex flex-col window-shadow border border-white/40 select-auto transition-colors duration-300 ${isActive ? 'glass-active bg-[#fbfbfd]/90' : 'glass bg-[#f2f2f7]/80'}`}
      onMouseDown={() => focusWindow(id)}
      drag={!isMaximized && !isSplitView && !isCentered}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
    >
      {/* Title Bar */}
      <div 
        className={`h-11 relative flex items-center px-4 cursor-move border-b transition-colors ${isActive ? 'bg-white/50 border-black/5' : 'bg-white/20 border-black/[0.02]'}`}
        onPointerDown={(e) => {
          focusWindow(id);
          dragControls.start(e);
        }}
      >
        <div className="flex gap-2 group/controls z-10 relative" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => closeWindow(id)} className="traffic-light bg-[#ff5f57] hover:bg-[#ff5f57] shadow-sm">
            <X size={7} className="text-black/50" />
          </button>
          <button onClick={() => toggleSplitView(id)} className="traffic-light bg-[#febc2e] hover:bg-[#febc2e] shadow-sm">
            <div className="w-[1px] h-1.5 bg-black/40" />
          </button>
          <button onClick={() => toggleCenter(id)} className="traffic-light bg-[#28c840] hover:bg-[#28c840] shadow-sm">
            <div className="w-1.5 h-[1px] bg-black/40" />
          </button>
        </div>
        
        <div className={`absolute left-1/2 -translate-x-1/2 text-[13px] font-medium pointer-events-none transition-colors w-full text-center ${isActive ? 'text-black/70' : 'text-black/30'}`}>
          {title}
        </div>

        <div className="absolute right-4 z-10" onPointerDown={(e) => e.stopPropagation()}>
            <button onClick={() => maximizeWindow(id)} className="opacity-0 group-hover/controls:opacity-30 hover:!opacity-60 transition-opacity">
                <Maximize2 size={10} />
            </button>
        </div>
      </div>
      <div className={`flex-1 overflow-hidden p-0 transition-colors ${isActive ? 'bg-white/60' : 'bg-white/30'}`}>
        <ErrorBoundary fallback={<div className="p-6 text-red-500 font-mono text-xs uppercase h-full flex items-center justify-center">Error loading module</div>}>
          {content}
        </ErrorBoundary>
      </div>
    </motion.div>
  );
};

const NotesApp: React.FC = () => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notesList, setNotesList] = useState<string[]>([]);

  // Seed data for the "review" test (simulating what is on disk)
  useEffect(() => {
    const pastDates = [
      '2026-01-31', '2026-02-01', '2026-02-02', 
      '2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06'
    ];
    // Pre-populate localStorage if empty so review works immediately
    pastDates.forEach(d => {
      if (!localStorage.getItem(`note_${d}`)) {
        localStorage.setItem(`note_${d}`, `# Daily Note - ${d}\n\n## Notes\n- Simulated content for review.`);
      }
    });
    setNotesList([...pastDates, new Date().toISOString().split('T')[0]].sort().reverse());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`note_${date}`);
    if (saved) setContent(saved);
    else setContent(`# Daily Note - ${date}\n\n`);
  }, [date]);

  const handleSync = async () => {
    localStorage.setItem(`note_${date}`, content);
    try {
      const res = await fetch('/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `${date}.md`, content })
      });
      const data = await res.json();
      console.log('Saved:', data.saved);
    } catch (e) {
      console.error('Save failed');
    }
  };

  return (
    <div className="flex h-full text-[#1d1d1f] p-0 bg-[#f5f5f7]">
      {/* Sidebar */}
      <div className="w-48 border-r border-black/[0.05] bg-[#f2f2f7]/50 flex flex-col">
        <div className="p-3 text-[10px] font-semibold text-black/40 uppercase tracking-widest pl-4">History</div>
        <div className="flex-1 overflow-y-auto">
          {notesList.map(d => (
            <div 
              key={d}
              onClick={() => setDate(d)}
              className={`px-4 py-2 text-[12px] font-medium cursor-pointer transition-colors ${date === d ? 'bg-white shadow-sm text-blue-600' : 'text-black/70 hover:bg-black/5'}`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.04] bg-white/80">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-black/80">Daily Note</span>
              <span className="text-[10px] font-medium text-black/40 uppercase tracking-wide">{date}.md</span>
            </div>
          </div>
          <button 
            onClick={handleSync} 
            className="flex items-center gap-2 bg-white/80 hover:bg-white border border-black/10 hover:border-black/20 text-black/70 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all shadow-sm active:scale-95 active:shadow-inner"
          >
            <Save size={14} className="text-blue-500" /> 
            <span>Save</span>
          </button>
        </div>
        <textarea
          className="flex-1 bg-transparent border-none outline-none resize-none font-sans text-[15px] leading-7 text-[#1d1d1f] p-8 placeholder:text-black/20 selection:bg-blue-100"
          placeholder="Capture your thoughts..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            localStorage.setItem(`note_${date}`, e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const DockIcon = ({ icon: Icon, mouseX, onClick, label, id }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-150, 0, 150], [52, 80, 52]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 15 });

  const { activeWindowId } = useOSStore();
  const isActive = activeWindowId === id;

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer group relative bg-[#f5f5f7]/80 hover:bg-white/90 transition-colors border border-white/50 shadow-sm"
    >
      <Icon className={`w-1/2 h-1/2 ${isActive ? 'text-[#007AFF]' : 'text-black/50'} group-hover:text-black/80 transition-all`} />
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#f5f5f7]/95 rounded-lg text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap text-[#1d1d1f] shadow-md border border-white/50">
        {label}
        {/* Little triangle arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[4px] border-transparent border-t-white/50" />
      </div>
      {isActive && (
        <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-black/40" />
      )}
    </motion.div>
  );
};

const Dock: React.FC = () => {
  const mouseX = useMotionValue(Infinity);
  const { openWindow } = useOSStore();

  const apps = [
    { id: 'finder', label: 'Finder', icon: Smile, component: <FinderApp /> },
    { id: 'surf', label: 'Surf', icon: Globe, component: <BrowserApp /> },
    { id: 'notes', label: 'Notes', icon: FileText, component: <NotesApp /> },
    { id: 'payload', label: 'Payload', icon: Send, component: <PayloadApp /> },
    { id: 'console', label: 'Dex Console', icon: Chip, component: <DexConsoleApp /> },
    { id: 'brain', label: 'Brain', icon: Brain, component: <BrainApp /> },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon, component: <TerminalApp /> },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon, component: <div className="p-12 text-[#86868b] font-medium text-center h-full flex flex-col justify-center gap-4 bg-[#f2f2f7]/50">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-2 shadow-inner">
        <SettingsIcon size={32} className="text-gray-400" />
      </div>
      <div className="text-lg text-[#1d1d1f]">System Settings</div>
      <div className="text-[12px] opacity-60">Null State v1.0.0</div>
    </div> },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2000]">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="h-[76px] px-4 glass-dock rounded-[24px] flex items-end gap-3 pb-3 border border-white/40 dock-shadow"
      >
        {apps.map((app) => (
          <DockIcon key={app.id} {...app} mouseX={mouseX} onClick={() => openWindow(app.id, app.label, app.component)} />
        ))}
      </motion.div>
    </div>
  );
};

const Spotlight: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { openWindow } = useOSStore();

  const apps = [
    { id: 'finder', name: 'Finder', icon: '📂', component: <FinderApp /> },
    { id: 'surf', name: 'Surf', icon: '🌍', component: <BrowserApp /> },
    { id: 'notes', name: 'Notes', icon: '📝', component: <NotesApp /> },
    { id: 'payload', name: 'Payload Launcher', icon: '🚀', component: <PayloadApp /> },
    { id: 'console', name: 'Dex Console', icon: '🎛️', component: <DexConsoleApp /> },
    { id: 'brain', name: 'Local Brain', icon: '🧠', component: <BrainApp /> },
    { id: 'terminal', name: 'Terminal', icon: '💻', component: <TerminalApp /> },
  ];

  const filtered = apps.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && filtered.length > 0) {
        openWindow(filtered[0].id, filtered[0].name, filtered[0].component);
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, onClose, openWindow]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-start justify-center pt-[20vh] bg-[#f5f5f7]/40" onClick={onClose}>
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: -10 }}
            className="w-[680px] rounded-2xl shadow-2xl overflow-hidden border border-white/60 p-1 bg-[#fbfbfd]/95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-5 py-4 gap-4">
              <Search className="text-black/30" size={22} />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-2xl font-light text-[#1d1d1f] placeholder:text-black/20"
                placeholder="Spotlight Search"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            {query && (
              <div className="max-h-[340px] overflow-auto p-2 border-t border-black/[0.03]">
                {filtered.map((app, i) => (
                  <div
                    key={app.id}
                    className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-colors ${i === 0 ? 'bg-[#007AFF] text-white shadow-md' : 'hover:bg-black/5 text-black/70'}`}
                    onClick={() => { openWindow(app.id, app.name, app.component); onClose(); }}
                  >
                    <span className="text-xl">{app.icon}</span>
                    <span className="font-semibold text-lg tracking-tight">{app.name}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- App Root ---

function App() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const { windows } = useOSStore();
  const { getChildren } = useFileSystemStore();
  const desktopIcons = getChildren('desktop');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative bg-[#F2F2F7] text-[#1d1d1f] antialiased font-sans">
      <TopBar />
      
      <main className="flex-1 relative">
        {/* 
           macOS Big Sur / Monterey Style Gradient
           High contrast, vibrant, abstract mesh.
        */}
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,_hsla(253,16%,7%,1)_0,transparent_50%),_radial-gradient(at_50%_0%,_hsla(225,39%,30%,1)_0,transparent_50%),_radial-gradient(at_100%_0%,_hsla(339,49%,30%,1)_0,transparent_50%)] bg-[#f5f5f7]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_50%,_hsla(339,49%,30%,1)_0,transparent_50%),_radial-gradient(at_100%_50%,_hsla(339,49%,30%,1)_0,transparent_50%),_radial-gradient(at_0%_100%,_hsla(225,39%,30%,1)_0,transparent_50%),_radial-gradient(at_50%_100%,_hsla(225,39%,30%,1)_0,transparent_50%),_radial-gradient(at_100%_100%,_hsla(253,16%,7%,1)_0,transparent_50%)] mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-[#f0f0f5]/60" />
        
        {/* Desktop Icons */}
        <div className="absolute top-8 right-4 flex flex-col gap-4 p-4 z-10 items-end">
          {desktopIcons.map((node) => (
            <div key={node.id} className="group flex flex-col items-center gap-1 w-20 cursor-pointer">
              <div className="w-14 h-14 bg-white/70 rounded-xl flex items-center justify-center shadow-sm border border-white/50 group-hover:bg-blue-100/50 transition-colors">
                {node.type === 'folder' ? <Folder size={32} className="text-blue-500" /> : <FileText size={32} className="text-gray-500" />}
              </div>
              <span className="text-[11px] font-medium text-black/70 bg-white/60 px-2 py-0.5 rounded shadow-sm group-hover:text-blue-600 truncate max-w-full text-center">
                {node.name}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {windows.map((win) => (
            win.isOpen && !win.isMinimized && <Window key={win.id} {...win} />
          ))}
        </AnimatePresence>
      </main>

      <Dock />

      <Spotlight isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </div>
  );
}

export default App;
