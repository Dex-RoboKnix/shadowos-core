import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NodeType = 'folder' | 'file';

export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  type: NodeType;
  content?: string; // For files
  children?: string[]; // For folders (ids)
  createdAt: number;
  modifiedAt: number;
}

interface FileSystemState {
  nodes: Record<string, FileNode>;
  rootId: string;
  
  createFile: (parentId: string, name: string, content?: string) => string;
  createFolder: (parentId: string, name: string) => string;
  deleteNode: (id: string) => void;
  updateFile: (id: string, content: string) => void;
  renameNode: (id: string, name: string) => void;
  getNode: (id: string) => FileNode | undefined;
  getChildren: (id: string) => FileNode[];
}

const DEFAULT_ROOT_ID = 'root';
const HOME_ID = 'home';
const DESKTOP_ID = 'desktop';
const DOCS_ID = 'documents';
const DOWNLOADS_ID = 'downloads';

const INITIAL_NODES: Record<string, FileNode> = {
  [DEFAULT_ROOT_ID]: {
    id: DEFAULT_ROOT_ID,
    parentId: null,
    name: 'Root',
    type: 'folder',
    children: [HOME_ID],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
  [HOME_ID]: {
    id: HOME_ID,
    parentId: DEFAULT_ROOT_ID,
    name: 'Home',
    type: 'folder',
    children: [DESKTOP_ID, DOCS_ID, DOWNLOADS_ID],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
  [DESKTOP_ID]: {
    id: DESKTOP_ID,
    parentId: HOME_ID,
    name: 'Desktop',
    type: 'folder',
    children: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
  [DOCS_ID]: {
    id: DOCS_ID,
    parentId: HOME_ID,
    name: 'Documents',
    type: 'folder',
    children: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
  [DOWNLOADS_ID]: {
    id: DOWNLOADS_ID,
    parentId: HOME_ID,
    name: 'Downloads',
    type: 'folder',
    children: [],
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  },
};

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      nodes: INITIAL_NODES,
      rootId: DEFAULT_ROOT_ID,

      createFile: (parentId, name, content = '') => {
        const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNode: FileNode = {
          id,
          parentId,
          name,
          type: 'file',
          content,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        };

        set((state) => {
          const parent = state.nodes[parentId];
          if (!parent || parent.type !== 'folder') return state;

          return {
            nodes: {
              ...state.nodes,
              [id]: newNode,
              [parentId]: {
                ...parent,
                children: [...(parent.children || []), id],
              },
            },
          };
        });
        return id;
      },

      createFolder: (parentId, name) => {
        const id = `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNode: FileNode = {
          id,
          parentId,
          name,
          type: 'folder',
          children: [],
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        };

        set((state) => {
          const parent = state.nodes[parentId];
          if (!parent || parent.type !== 'folder') return state;

          return {
            nodes: {
              ...state.nodes,
              [id]: newNode,
              [parentId]: {
                ...parent,
                children: [...(parent.children || []), id],
              },
            },
          };
        });
        return id;
      },

      deleteNode: (id) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node || !node.parentId) return state; // Can't delete root/orphans easily logic

          const parent = state.nodes[node.parentId];
          const newNodes = { ...state.nodes };
          delete newNodes[id];

          // Simple recursive delete for children if folder
          const deleteRecursive = (nodeId: string) => {
             const n = state.nodes[nodeId];
             if(n && n.children) {
                 n.children.forEach(deleteRecursive);
             }
             delete newNodes[nodeId];
          }
          deleteRecursive(id);

          return {
            nodes: {
              ...newNodes,
              [node.parentId]: {
                ...parent,
                children: parent.children?.filter((childId) => childId !== id),
              },
            },
          };
        });
      },

      updateFile: (id, content) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: {
              ...state.nodes[id],
              content,
              modifiedAt: Date.now(),
            },
          },
        }));
      },

      renameNode: (id, name) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: {
              ...state.nodes[id],
              name,
              modifiedAt: Date.now(),
            },
          },
        }));
      },

      getNode: (id) => get().nodes[id],
      getChildren: (id) => {
        const node = get().nodes[id];
        if (!node || !node.children) return [];
        return node.children.map((childId) => get().nodes[childId]).filter(Boolean);
      },
    }),
    {
      name: 'shadow-fs-storage',
    }
  )
);
