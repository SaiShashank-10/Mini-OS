
import React, { useState, useRef, useEffect } from "react";
import { useOS, AppWindow as AppWindowType } from "@/contexts/OSContext";
import { X, Minus } from "lucide-react";
import Calculator from "@/components/apps/Calculator";
import Settings from "@/components/apps/Settings";
import Terminal from "@/components/apps/Terminal";
import Notes from "@/components/apps/Notes";
import FileManager from "@/components/apps/FileManager";
import { cn } from "@/lib/utils";

interface AppWindowProps {
  app: AppWindowType;
}

const AppWindow: React.FC<AppWindowProps> = ({ app }) => {
  const { closeApp, minimizeApp, setActiveApp, updateAppPosition, updateAppSize } = useOS();
  
  // Refs for drag and resize
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Focus this window when clicked
  const handleWindowClick = () => {
    setActiveApp(app.id);
  };
  
  // Start dragging the window
  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      
      // Prevent text selection during drag
      e.preventDefault();
    }
  };
  
  // Handle dragging logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Update position
        updateAppPosition(app.id, { x, y });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, app.id, updateAppPosition]);
  
  // Focus window when it appears
  useEffect(() => {
    setActiveApp(app.id);
  }, [app.id, setActiveApp]);
  
  // Render the appropriate app content
  const renderAppContent = () => {
    switch (app.type) {
      case "calculator":
        return <Calculator />;
      case "settings":
        return <Settings />;
      case "terminal":
        return <Terminal />;
      case "notes":
        return <Notes />;
      case "fileManager":
        return <FileManager />;
      default:
        return <div>App content not available</div>;
    }
  };
  
  return (
    <div
      ref={windowRef}
      className={cn(
        "window absolute overflow-hidden flex flex-col",
        app.isActive ? "z-10 shadow-xl" : "z-0 opacity-90"
      )}
      style={{
        left: app.position.x,
        top: app.position.y,
        width: app.size.width,
        height: app.size.height,
      }}
      onMouseDown={handleWindowClick}
    >
      {/* Window Header */}
      <div 
        ref={headerRef}
        className="window-title cursor-grab select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-medium">{app.title}</div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded hover:bg-white/10"
            onClick={() => minimizeApp(app.id)}
          >
            <Minus size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-destructive"
            onClick={() => closeApp(app.id)}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="window-content">
        {renderAppContent()}
      </div>
    </div>
  );
};

export default AppWindow;
