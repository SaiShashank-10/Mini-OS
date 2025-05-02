
import React from "react";
import { useOS } from "@/contexts/OSContext";
import { Calculator, Settings, Terminal, FileText, Computer, Power } from "lucide-react";

const StartMenu: React.FC = () => {
  const { openApp } = useOS();
  
  const appItems = [
    { name: "File Manager", icon: <Computer size={24} />, type: "fileManager" },
    { name: "Calculator", icon: <Calculator size={24} />, type: "calculator" },
    { name: "Notes", icon: <FileText size={24} />, type: "notes" },
    { name: "Terminal", icon: <Terminal size={24} />, type: "terminal" },
    { name: "Settings", icon: <Settings size={24} />, type: "settings" }
  ];
  
  return (
    <div className="absolute bottom-14 left-0 w-80 glass-effect border border-white/10 rounded-t-lg shadow-xl z-40 animate-slide-up start-menu">
      <div className="p-4 flex flex-col">
        <h2 className="text-xl font-medium mb-4">Applications</h2>
        
        {/* Apps List */}
        <div className="flex flex-col gap-1">
          {appItems.map((app) => (
            <div 
              key={app.name} 
              className="start-menu-item"
              onClick={() => openApp(app.type as any)}
            >
              <div className="p-2 bg-secondary rounded-lg">
                {app.icon}
              </div>
              <span>{app.name}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="start-menu-item">
            <div className="p-2 bg-destructive/20 text-destructive-foreground rounded-lg">
              <Power size={24} />
            </div>
            <span>Power Off</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
