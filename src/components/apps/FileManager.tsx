
import React, { useState, useEffect } from "react";
import {
  Folder,
  File,
  ChevronRight,
  ArrowUp,
  LayoutGrid,
  List as ListIcon,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified?: Date;
  content?: string;
  parent: string | null;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [path, setPath] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "Home" },
  ]);
  
  // Initial file system setup
  useEffect(() => {
    const initialFiles: FileSystemItem[] = [
      {
        id: "root",
        name: "Home",
        type: "folder",
        parent: null,
      },
      {
        id: "documents",
        name: "Documents",
        type: "folder",
        parent: "root",
      },
      {
        id: "pictures",
        name: "Pictures",
        type: "folder",
        parent: "root",
      },
      {
        id: "downloads",
        name: "Downloads",
        type: "folder",
        parent: "root",
      },
      {
        id: "readme",
        name: "README.txt",
        type: "file",
        size: "2 KB",
        lastModified: new Date(),
        content: "Welcome to Mini OS file system.",
        parent: "root",
      },
      {
        id: "doc1",
        name: "Project Notes.txt",
        type: "file",
        size: "15 KB",
        lastModified: new Date(),
        parent: "documents",
      },
      {
        id: "doc2",
        name: "Report.pdf",
        type: "file",
        size: "1.2 MB",
        lastModified: new Date(),
        parent: "documents",
      },
      {
        id: "pic1",
        name: "Vacation.jpg",
        type: "file",
        size: "3.5 MB",
        lastModified: new Date(),
        parent: "pictures",
      },
      {
        id: "pic2",
        name: "Profile.png",
        type: "file",
        size: "1.8 MB",
        lastModified: new Date(),
        parent: "pictures",
      },
      {
        id: "dl1",
        name: "installer.exe",
        type: "file",
        size: "45 MB",
        lastModified: new Date(),
        parent: "downloads",
      },
    ];
    
    setFiles(initialFiles);
  }, []);
  
  // Get the current folder's files and subfolders
  const getCurrentFolderContents = () => {
    return files.filter(item => item.parent === currentFolder);
  };
  
  // Navigate to a folder
  const navigateToFolder = (folderId: string) => {
    const folder = files.find(item => item.id === folderId);
    
    if (folder) {
      setCurrentFolder(folderId);
      
      // Update the path
      let newPath: { id: string; name: string }[] = [];
      let current = folder;
      
      while (current) {
        newPath.unshift({ id: current.id, name: current.name });
        const parent = files.find(item => item.id === current.parent);
        if (!parent || current.id === "root") break;
        current = parent;
      }
      
      setPath(newPath);
    }
  };
  
  // Navigate up one level
  const navigateUp = () => {
    if (currentFolder === "root") return;
    
    const currentItem = files.find(item => item.id === currentFolder);
    if (currentItem && currentItem.parent) {
      navigateToFolder(currentItem.parent);
    }
  };
  
  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={navigateUp}
        >
          <ArrowUp size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigateToFolder("root")}
        >
          <Home size={18} />
        </Button>
        
        <div className="flex-1 flex items-center px-2 py-1 bg-black/20 rounded-md text-sm">
          {path.map((item, index) => (
            <React.Fragment key={item.id}>
              <span 
                className="cursor-pointer hover:text-blue-400"
                onClick={() => navigateToFolder(item.id)}
              >
                {item.name}
              </span>
              {index < path.length - 1 && (
                <ChevronRight size={14} className="mx-1 opacity-70" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Button 
          variant={viewType === "grid" ? "secondary" : "ghost"} 
          size="icon"
          onClick={() => setViewType("grid")}
        >
          <LayoutGrid size={18} />
        </Button>
        <Button 
          variant={viewType === "list" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setViewType("list")}
        >
          <ListIcon size={18} />
        </Button>
      </div>
      
      {/* File Browser */}
      {viewType === "grid" ? (
        <div className="flex-1 p-4 overflow-auto grid grid-cols-5 gap-4">
          {getCurrentFolderContents().map(item => (
            <div
              key={item.id}
              className="file-item"
              onDoubleClick={() => item.type === "folder" ? navigateToFolder(item.id) : undefined}
            >
              <div className="flex items-center justify-center h-12 w-12">
                {item.type === "folder" ? (
                  <Folder size={40} className="text-yellow-400" />
                ) : (
                  <File size={36} className="text-blue-400" />
                )}
              </div>
              <span className="mt-1 text-sm break-words max-w-full">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-2 text-left font-medium text-sm">Name</th>
                <th className="p-2 text-left font-medium text-sm">Size</th>
                <th className="p-2 text-left font-medium text-sm">Modified</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentFolderContents().map(item => (
                <tr 
                  key={item.id}
                  className="hover:bg-white/10 cursor-pointer"
                  onDoubleClick={() => item.type === "folder" ? navigateToFolder(item.id) : undefined}
                >
                  <td className="p-2 flex items-center gap-2">
                    {item.type === "folder" ? (
                      <Folder size={16} className="text-yellow-400" />
                    ) : (
                      <File size={16} className="text-blue-400" />
                    )}
                    {item.name}
                  </td>
                  <td className="p-2 text-sm">{item.size || "-"}</td>
                  <td className="p-2 text-sm">{formatDate(item.lastModified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileManager;
