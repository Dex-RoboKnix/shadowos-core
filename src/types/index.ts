import React from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: React.ReactNode;
}

export interface DockApp {
  id: string;
  name: string;
  icon: string;
  label: string;
}

export interface DesktopConfig {
  wallpaper: string;
  theme: 'light' | 'dark';
}

export interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}
