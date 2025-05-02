
import React from "react";
import { useOS } from "@/contexts/OSContext";
import { Calculator, Settings, Terminal, FileText, Computer } from "lucide-react";

const DesktopIcons: React.FC = () => {
  const { openApp } = useOS();
  
  const desktopIcons = [
    { name: "File Manager", icon: <Computer size={32} />, type: "fileManager" },
    { name: "Calculator", icon: <Calculator size={32} />, type: "calculator" },
    { name: "Notes", icon: <FileText size={32} />, type: "notes" },
    { name: "Terminal", icon: <Terminal size={32} />, type: "terminal" },
    { name: "Settings", icon: <Settings size={32} />, type: "settings" }
  ];
  
  return (
    <div className="absolute top-4 left-4 grid grid-cols-1 gap-6">
      {desktopIcons.map((icon) => (
        <div 
          key={icon.name}
          className="file-item w-20"
          onDoubleClick={() => openApp(icon.type as any)}
        >
          <div className="flex items-center justify-center h-12">
            {icon.icon}
          </div>
          <span className="text-xs text-white text-shadow shadow-black">
            {icon.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DesktopIcons;
