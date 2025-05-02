
import React from "react";
import { useOS } from "@/contexts/OSContext";
import { Computer, Calculator, Settings, Terminal, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TaskBar: React.FC = () => {
  const { openApps, toggleStartMenu, startMenuOpen, restoreApp } = useOS();
  
  // Get app icon based on type
  const getAppIcon = (type: string) => {
    switch (type) {
      case "calculator":
        return <Calculator size={24} />;
      case "settings":
        return <Settings size={24} />;
      case "terminal":
        return <Terminal size={24} />;
      case "notes":
        return <FileText size={24} />;
      case "fileManager":
        return <Computer size={24} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-14 bg-black/40 backdrop-blur-lg border-t border-white/10 items-center px-1 z-50">
      {/* Start Button */}
      <button 
        className={cn("task-bar-item start-button", { "bg-primary/30": startMenuOpen })}
        onClick={toggleStartMenu}
      >
        <Computer size={24} />
      </button>
      
      {/* App Icons */}
      <div className="flex flex-1 h-full items-center gap-1">
        {openApps.map(app => (
          <button 
            key={app.id} 
            className={cn(
              "task-bar-item", 
              app.isActive ? "bg-white/20 border-b-2 border-primary" : app.isMinimized ? "opacity-70" : ""
            )}
            onClick={() => restoreApp(app.id)}
          >
            {getAppIcon(app.type || "")}
          </button>
        ))}
      </div>
      
      {/* Clock */}
      <div className="px-4 text-sm">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default TaskBar;
