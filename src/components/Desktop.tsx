
import React, { useEffect, MouseEvent } from "react";
import { useOS } from "@/contexts/OSContext";
import TaskBar from "@/components/TaskBar";
import StartMenu from "@/components/StartMenu";
import AppWindow from "@/components/AppWindow";
import DesktopIcons from "@/components/DesktopIcons";

const Desktop: React.FC = () => {
  const { openApps, startMenuOpen, closeStartMenu } = useOS();

  // Close start menu when clicking outside
  const handleDesktopClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Don't close if clicking on TaskBar or StartMenu
    if (!target.closest('.start-menu') && !target.closest('.start-button')) {
      closeStartMenu();
    }
  };

  // Prevent context menu on right-click 
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-desktop bg-cover bg-center relative overflow-hidden"
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
    >
      <div className="flex-1 relative">
        <DesktopIcons />
        
        {/* App Windows */}
        {openApps.map((app) => (
          !app.isMinimized && (
            <AppWindow
              key={app.id}
              app={app}
            />
          )
        ))}
      </div>
      
      {/* Start Menu */}
      {startMenuOpen && <StartMenu />}
      
      {/* TaskBar */}
      <TaskBar />
    </div>
  );
};

export default Desktop;
