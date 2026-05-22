import { create } from 'zustand';
import React from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isSplitView: boolean;
  isCentered: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: React.ReactNode;
}

interface OSStore {
  windows: WindowState[];
  activeWindowId: string | null;
  virtualRAM: number; // 0 to 100
  maxRAMObjects: number;
  
  openWindow: (id: string, title: string, content: React.ReactNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  toggleSplitView: (id: string) => void;
  toggleCenter: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  garbageCollect: () => void;
}

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  virtualRAM: 0,
  maxRAMObjects: 10,

  openWindow: (id, title, content) => {
    const { windows, maxRAMObjects, garbageCollect } = get();
    const existing = windows.find(w => w.id === id);
    
    if (existing) {
      set({
        activeWindowId: id,
        windows: windows.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: windows.length + 100 } : w)
      });
      return;
    }

    const newUsage = ((windows.length + 1) / maxRAMObjects) * 100;
    
    const newWindow: WindowState = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isSplitView: false,
      isCentered: false,
      zIndex: windows.length + 100,
      x: 100 + (windows.length * 30),
      y: 100 + (windows.length * 30),
      width: 600,
      height: 400,
      content
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      virtualRAM: newUsage
    });

    if (newUsage > 95) {
      garbageCollect();
    }
  },

  closeWindow: (id) => set((state) => {
    const filtered = state.windows.filter(w => w.id !== id);
    return {
      windows: filtered,
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      virtualRAM: (filtered.length / state.maxRAMObjects) * 100
    };
  }),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w)
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, isSplitView: false, isCentered: false } : w)
  })),

  toggleSplitView: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isSplitView: !w.isSplitView, isMaximized: false, isCentered: false } : w)
  })),

  toggleCenter: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isCentered: !w.isCentered, isMaximized: false, isSplitView: false } : w)
  })),

  focusWindow: (id) => set((state) => {
    const maxZ = Math.max(...state.windows.map(w => w.zIndex), 100);
    return {
      activeWindowId: id,
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w)
    };
  }),

  updatePosition: (id, x, y) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
  })),

  garbageCollect: () => set((state) => {
    const active = state.windows.slice(-3);
    return {
      windows: active,
      virtualRAM: (active.length / state.maxRAMObjects) * 100
    };
  })
}));
