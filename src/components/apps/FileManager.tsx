
import React, { useState, useEffect } from "react";
import {
  Folder,
  File,
  ChevronRight,
  ArrowUp,
  LayoutGrid,
  List as ListIcon,
  Home,
  Search,
  Download,
  Upload,
  Plus,
  Trash,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemType, setNewItemType] = useState<"file" | "folder">("file");
  const [showNewItemDialog, setShowNewItemDialog] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<{id: string, name: string, content: string} | null>(null);
  
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
        content: "Welcome to Mini OS file system. This is a simulation of a file system in a web browser.",
        parent: "root",
      },
      {
        id: "doc1",
        name: "Project Notes.txt",
        type: "file",
        size: "15 KB",
        lastModified: new Date(),
        content: "Important project notes for the upcoming release.",
        parent: "documents",
      },
      {
        id: "doc2",
        name: "Report.pdf",
        type: "file",
        size: "1.2 MB",
        lastModified: new Date(),
        content: "[PDF content would appear here]",
        parent: "documents",
      },
      {
        id: "pic1",
        name: "Vacation.jpg",
        type: "file",
        size: "3.5 MB",
        lastModified: new Date(),
        content: "[Image would display here]",
        parent: "pictures",
      },
      {
        id: "pic2",
        name: "Profile.png",
        type: "file",
        size: "1.8 MB",
        lastModified: new Date(),
        content: "[Image would display here]",
        parent: "pictures",
      },
      {
        id: "dl1",
        name: "installer.exe",
        type: "file",
        size: "45 MB",
        lastModified: new Date(),
        content: "[Binary content]",
        parent: "downloads",
      },
      {
        id: "notes",
        name: "Notes",
        type: "folder",
        parent: "root",
      },
      // We'll sync with the Notes app here
      {
        id: "system-notes",
        name: "System Notes.txt",
        type: "file",
        size: "8 KB",
        lastModified: new Date(),
        content: "System notes created by the Notes application.",
        parent: "notes",
      }
    ];
    
    setFiles(initialFiles);
    
    // Try to load notes from localStorage
    try {
      const savedNotes = localStorage.getItem('miniOS-notes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        // Convert notes to file system items
        const noteFiles = notes.map((note: any) => ({
          id: `note-${note.id}`,
          name: `${note.title}.txt`,
          type: "file" as const,
          size: `${Math.floor(note.content.length / 10)} KB`,
          lastModified: new Date(note.lastEdited),
          content: note.content,
          parent: "notes",
        }));
        
        setFiles(prev => [...prev, ...noteFiles]);
      }
    } catch (e) {
      console.error("Error loading notes:", e);
    }
  }, []);
  
  // Get the current folder's files and subfolders
  const getCurrentFolderContents = () => {
    const filtered = files.filter(item => {
      const matchesParent = item.parent === currentFolder;
      const matchesSearch = searchQuery 
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesParent && matchesSearch;
    });
    
    return sortItems(filtered);
  };
  
  // Sort items
  const sortItems = (items: FileSystemItem[]) => {
    return [...items].sort((a, b) => {
      // Always put folders before files
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      
      let compareValue = 0;
      
      switch (sortBy) {
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "modified":
          compareValue = (a.lastModified?.getTime() || 0) - (b.lastModified?.getTime() || 0);
          break;
        case "size":
          // Extract numeric part for size comparison
          const getSize = (size?: string) => {
            if (!size) return 0;
            const match = size.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
          };
          compareValue = getSize(a.size) - getSize(b.size);
          break;
      }
      
      return sortDirection === "asc" ? compareValue : -compareValue;
    });
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
      setSelectedFile(null);
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

  // Toggle sort direction or change sort field
  const toggleSort = (field: "name" | "modified" | "size") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Create a new item
  const createNewItem = () => {
    if (!newItemName) {
      toast({
        title: "Error",
        description: "Please provide a name for the new item",
        variant: "destructive"
      });
      return;
    }
    
    // Check if name already exists in current folder
    const exists = files.some(
      item => item.parent === currentFolder && item.name === newItemName
    );
    
    if (exists) {
      toast({
        title: "Error",
        description: "An item with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: FileSystemItem = {
      id: `${newItemType}-${Date.now()}`,
      name: newItemName,
      type: newItemType,
      parent: currentFolder,
      lastModified: new Date(),
    };
    
    if (newItemType === "file") {
      newItem.size = "0 KB";
      newItem.content = "";
    }
    
    setFiles(prev => [...prev, newItem]);
    setNewItemName("");
    setShowNewItemDialog(false);
    
    toast({
      title: "Success",
      description: `${newItemType === "folder" ? "Folder" : "File"} created successfully`,
    });
  };

  // Handle file selection
  const handleFileClick = (id: string) => {
    setSelectedFile(selectedFile === id ? null : id);
  };

  // Handle file double click
  const handleFileDoubleClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      navigateToFolder(item.id);
    } else {
      // Preview file
      setFilePreview({
        id: item.id,
        name: item.name,
        content: item.content || "No content available"
      });
    }
  };

  // Delete selected file or folder
  const deleteSelected = () => {
    if (!selectedFile) return;
    
    const selectedItem = files.find(item => item.id === selectedFile);
    if (!selectedItem) return;
    
    // If it's a folder, also delete all items inside
    if (selectedItem.type === "folder") {
      const itemsToDelete = getItemsInFolder(selectedFile);
      setFiles(files.filter(item => !itemsToDelete.includes(item.id)));
    } else {
      setFiles(files.filter(item => item.id !== selectedFile));
    }
    
    setSelectedFile(null);
    toast({
      title: "Deleted",
      description: `${selectedItem.name} has been deleted`
    });
  };

  // Get all items in a folder (recursively)
  const getItemsInFolder = (folderId: string): string[] => {
    const directChildren = files
      .filter(item => item.parent === folderId)
      .map(item => item.id);
    
    const nestedChildren = directChildren
      .filter(id => files.find(item => item.id === id)?.type === "folder")
      .flatMap(id => getItemsInFolder(id));
    
    return [folderId, ...directChildren, ...nestedChildren];
  };

  // Search files
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  const getSortIcon = (field: "name" | "modified" | "size") => {
    if (sortBy !== field) return <ChevronRight size={14} className="opacity-0" />;
    return sortDirection === "asc" ? 
      <ArrowUp size={14} className="text-primary" /> : 
      <ArrowDown size={14} className="text-primary" />;
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
        
        <div className="flex items-center relative">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search files..."
            className="h-8 bg-black/20 border-none text-white"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 h-8 w-8"
              onClick={clearSearch}
            >
              <X size={14} />
            </Button>
          )}
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
      
      {/* Action buttons */}
      <div className="flex items-center gap-1 p-1 border-b border-white/10">
        <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Plus size={16} />
              <span>New</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 text-white">
            <DialogHeader>
              <DialogTitle>Create new item</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="file" onValueChange={(v) => setNewItemType(v as "file" | "folder")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">File</TabsTrigger>
                <TabsTrigger value="folder">Folder</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Enter name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="bg-neutral-800 text-white border-neutral-700"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewItemDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewItem}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={!selectedFile}
          onClick={deleteSelected}
        >
          <Trash size={16} />
          <span>Delete</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Upload size={16} />
          <span>Upload</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={!selectedFile}
        >
          <Download size={16} />
          <span>Download</span>
        </Button>
      </div>
      
      {/* File Browser */}
      {viewType === "grid" ? (
        <div className="flex-1 p-4 overflow-auto grid grid-cols-5 gap-4">
          {getCurrentFolderContents().map(item => (
            <div
              key={item.id}
              className={`file-item ${selectedFile === item.id ? "bg-blue-900/50" : ""}`}
              onClick={() => handleFileClick(item.id)}
              onDoubleClick={() => handleFileDoubleClick(item)}
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
                <th 
                  className="p-2 text-left font-medium text-sm cursor-pointer hover:bg-white/5 flex items-center"
                  onClick={() => toggleSort("name")}
                >
                  <span>Name</span>
                  {getSortIcon("name")}
                </th>
                <th 
                  className="p-2 text-left font-medium text-sm cursor-pointer hover:bg-white/5 flex items-center"
                  onClick={() => toggleSort("size")}
                >
                  <span>Size</span>
                  {getSortIcon("size")}
                </th>
                <th 
                  className="p-2 text-left font-medium text-sm cursor-pointer hover:bg-white/5 flex items-center"
                  onClick={() => toggleSort("modified")}
                >
                  <span>Modified</span>
                  {getSortIcon("modified")}
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentFolderContents().map(item => (
                <tr 
                  key={item.id}
                  className={`hover:bg-white/10 cursor-pointer ${selectedFile === item.id ? "bg-blue-900/40" : ""}`}
                  onClick={() => handleFileClick(item.id)}
                  onDoubleClick={() => handleFileDoubleClick(item)}
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
      
      {/* File Preview Dialog */}
      <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
        <DialogContent className="bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle>{filePreview?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-neutral-800 p-4 rounded min-h-[200px] max-h-[400px] overflow-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {filePreview?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileManager;
