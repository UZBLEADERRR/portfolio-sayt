import React, { createContext, useContext, useState } from 'react';

type PanelType = 'none' | 'video' | 'left-stats' | 'right-ai' | 'right-blog' | 'right-lang' | 'top-social';

interface UIContextType {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  togglePanel: (panel: PanelType) => void;
  activeStatId: number | null;
  setActiveStatId: (id: number | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelType>('none');
  const [activeStatId, setActiveStatId] = useState<number | null>(null);

  const togglePanel = (panel: PanelType) => {
    setActivePanel(current => current === panel ? 'none' : panel);
  };

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
