import React, { createContext, useContext, useState, useCallback } from 'react';

export type PanelType = 
  | 'none' 
  | 'video' 
  | 'left-stats' 
  | 'right-ai' 
  | 'right-blog' 
  | 'right-lang' 
  | 'social'
  | 'page-projects' 
  | 'page-services' 
  | 'page-courses' 
  | 'page-resume' 
  | 'page-contact';

interface UIContextType {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  togglePanel: (panel: PanelType) => void;
  activeStatId: number | null;
  setActiveStatId: (id: number | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanelRaw] = useState<PanelType>('none');
  const [activeStatId, setActiveStatId] = useState<number | null>(null);

  const setActivePanel = useCallback((panel: PanelType) => {
    setActivePanelRaw(panel);
    if (panel === 'none') {
      setActiveStatId(null);
    }
  }, []);

  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanelRaw(current => {
      const next = current === panel ? 'none' : panel;
      if (next === 'none') setActiveStatId(null);
      return next;
    });
  }, []);

  return (
    <UIContext.Provider value={{ activePanel, setActivePanel, togglePanel, activeStatId, setActiveStatId }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
