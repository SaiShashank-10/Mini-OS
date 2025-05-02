
import React, { createContext, useContext, useState, ReactNode } from "react";

export type AppType = "calculator" | "settings" | "terminal" | "notes" | "fileManager" | null;

export interface AppWindow {
  id: string;
  type: AppType;
  title: string;
  isMinimized: boolean;
  isActive: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface OSContextType {
  openApps: AppWindow[];
  startMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  openApp: (type: AppType) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  restoreApp: (id: string) => void;
  setActiveApp: (id: string) => void;
  updateAppPosition: (id: string, position: { x: number; y: number }) => void;
  updateAppSize: (id: string, size: { width: number; height: number }) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return context;
};

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openApps, setOpenApps] = useState<AppWindow[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const generateAppConfig = (type: AppType): AppWindow => {
    const id = `${type}-${Date.now()}`;
    let title = "App";
    let size = { width: 600, height: 400 };
    
    // Position new windows in a cascading manner
    const offset = openApps.length * 20;
    const position = { x: 100 + offset, y: 100 + offset };
    
    switch (type) {
      case "calculator":
        title = "Calculator";
        size = { width: 320, height: 400 };
        break;
      case "settings":
        title = "Settings";
        size = { width: 500, height: 500 };
        break;
      case "terminal":
        title = "Terminal";
        size = { width: 600, height: 400 };
        break;
      case "notes":
        title = "Notes";
        size = { width: 400, height: 500 };
        break;
      case "fileManager":
        title = "File Manager";
        size = { width: 700, height: 500 };
        break;
    }
    
    return {
      id,
      type,
      title,
      isMinimized: false,
      isActive: true,
      position,
      size,
    };
  };

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };
  
  const closeStartMenu = () => {
    setStartMenuOpen(false);
  };

  const openApp = (type: AppType) => {
    // If the app is already open, just activate it
    const existingApp = openApps.find(app => app.type === type && !app.isMinimized);
    
    if (existingApp) {
      setActiveApp(existingApp.id);
      return;
    }
    
    const newApp = generateAppConfig(type);
    
    setOpenApps(prevApps =>
      prevApps.map(app => ({
        ...app,
        isActive: false
      })).concat({ ...newApp })
    );
    
    closeStartMenu();
  };

  const closeApp = (id: string) => {
    setOpenApps(prevApps => prevApps.filter(app => app.id !== id));
  };

  const minimizeApp = (id: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.id === id
          ? { ...app, isMinimized: true, isActive: false }
          : app
      )
    );
  };

  const restoreApp = (id: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.id === id
          ? { ...app, isMinimized: false, isActive: true }
          : { ...app, isActive: false }
      )
    );
  };

  const setActiveApp = (id: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.id === id
          ? { ...app, isActive: true }
          : { ...app, isActive: false }
      )
    );
  };

  const updateAppPosition = (id: string, position: { x: number; y: number }) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.id === id ? { ...app, position } : app
      )
    );
  };

  const updateAppSize = (id: string, size: { width: number; height: number }) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.id === id ? { ...app, size } : app
      )
    );
  };

  return (
    <OSContext.Provider
      value={{
        openApps,
        startMenuOpen,
        toggleStartMenu,
        closeStartMenu,
        openApp,
        closeApp,
        minimizeApp,
        restoreApp,
        setActiveApp,
        updateAppPosition,
        updateAppSize,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};
