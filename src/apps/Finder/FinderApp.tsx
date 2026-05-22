import React, { useState } from 'react';
import { useFileSystemStore } from '../../stores/fileSystem';
import { Folder, FileText, ChevronLeft, ChevronRight, HardDrive, Monitor, Download } from 'lucide-react';

const FinderApp: React.FC = () => {
  const { nodes, getChildren } = useFileSystemStore();
  const [currentPath, setCurrentPath] = useState<string[]>(['home']); // Stack of folder IDs
  const currentFolderId = currentPath[currentPath.length - 1];
  const children = getChildren(currentFolderId);

  const navigateTo = (folderId: string) => {
    setCurrentPath([...currentPath, folderId]);
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleDoubleClick = (node: any) => {
    if (node.type === 'folder') {
      navigateTo(node.id);
    } else {
      // It's a file. Open it!
      // In a real OS, we'd check mime type. Here we assume text/md.
      // We need a way to open NotesApp with this file.
      // This requires upgrading NotesApp to accept a fileId or content prop.
      // For this MVP, we will just alert.
      alert(`Opening ${node.name}... (Integration Pending)`);
    }
  };

  const SidebarItem = ({ icon: Icon, label, id, active }: any) => (
    <div 
      className={`flex items-center gap-2 px-2 py-1 rounded-md text-[13px] cursor-default ${active ? 'bg-black/10' : 'hover:bg-black/5'}`}
      onClick={() => {
        // Reset path to this root
        if(id === 'home') setCurrentPath(['home']);
        else if (id === 'desktop') setCurrentPath(['home', 'desktop']);
        else if (id === 'documents') setCurrentPath(['home', 'documents']);
        else if (id === 'downloads') setCurrentPath(['home', 'downloads']);
      }}
    >
      <Icon size={14} className="text-blue-500" />
      <span className="text-black/80 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex h-full bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Sidebar */}
      <div className="w-48 bg-[#f2f2f7]/95 border-r border-black/5 p-3 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-black/30 px-2 mb-1 uppercase tracking-wider">Favorites</div>
        <SidebarItem icon={HardDrive} label="Macintosh HD" id="root" />
        <SidebarItem icon={Monitor} label="Desktop" id="desktop" active={currentFolderId === 'desktop'} />
        <SidebarItem icon={FileText} label="Documents" id="documents" active={currentFolderId === 'documents'} />
        <SidebarItem icon={Download} label="Downloads" id="downloads" active={currentFolderId === 'downloads'} />
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-10 border-b border-black/5 flex items-center px-4 gap-4 bg-[#fbfbfd]">
          <div className="flex gap-1">
            <button onClick={navigateUp} className="p-1 hover:bg-black/5 rounded disabled:opacity-30" disabled={currentPath.length <= 1}>
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-black/5 rounded opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="text-sm font-semibold text-black/70">
            {nodes[currentFolderId]?.name || 'Unknown'}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-y-auto">
          {children.length === 0 && (
            <div className="col-span-full text-center text-black/20 mt-10 text-sm">Folder is empty</div>
          )}
          {children.map((node) => (
            <div 
              key={node.id}
              className="flex flex-col items-center gap-1 group cursor-default"
              onDoubleClick={() => handleDoubleClick(node)}
            >
              <div className="w-16 h-16 bg-blue-100/50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors text-blue-500">
                {node.type === 'folder' ? <Folder size={32} /> : <FileText size={32} className="text-gray-500" />}
              </div>
              <span className="text-[12px] text-center w-full truncate px-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {node.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinderApp;
