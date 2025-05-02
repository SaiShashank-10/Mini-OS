
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, FilePlus, Trash, Check, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  lastEdited: Date;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  
  // Load notes from localStorage on initial load
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('miniOS-notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          lastEdited: new Date(note.lastEdited)
        }));
        setNotes(parsedNotes);
        
        if (parsedNotes.length > 0) {
          setSelectedNoteId(parsedNotes[0].id);
          setCurrentTitle(parsedNotes[0].title);
          setCurrentContent(parsedNotes[0].content);
        } else {
          createNewNote();
        }
      } else {
        createNewNote();
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      createNewNote();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update UI when selecting a different note
  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        setCurrentTitle(note.title);
        setCurrentContent(note.content);
        setIsEdited(false);
      }
    }
  }, [selectedNoteId, notes]);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('miniOS-notes', JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  }, [notes]);
  
  // Mark as edited when content changes
  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note && (note.title !== currentTitle || note.content !== currentContent)) {
        setIsEdited(true);
      } else {
        setIsEdited(false);
      }
    }
  }, [currentTitle, currentContent, selectedNoteId, notes]);
  
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      lastEdited: new Date()
    };
    
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent("");
    setIsEdited(false);
  };
  
  const saveCurrentNote = () => {
    if (!selectedNoteId) return;
    
    setNotes(prev => 
      prev.map(note => 
        note.id === selectedNoteId 
          ? { 
              ...note, 
              title: currentTitle || "Untitled Note", 
              content: currentContent, 
              lastEdited: new Date() 
            } 
          : note
      )
    );
    
    toast({
      title: "Note Saved",
      description: `Successfully saved "${currentTitle || "Untitled Note"}"`,
    });
    
    setIsEdited(false);
  };
  
  const deleteCurrentNote = () => {
    if (!selectedNoteId) return;
    
    const noteToDelete = notes.find(note => note.id === selectedNoteId);
    if (!noteToDelete) return;
    
    setNotes(prev => prev.filter(note => note.id !== selectedNoteId));
    
    toast({
      title: "Note Deleted",
      description: `"${noteToDelete.title}" has been removed`,
      variant: "destructive",
    });
    
    if (notes.length > 1) {
      // Find the next note to select
      const index = notes.findIndex(note => note.id === selectedNoteId);
      const nextIndex = index === 0 ? 1 : index - 1;
      setSelectedNoteId(notes[nextIndex === -1 ? 0 : nextIndex].id);
    } else {
      createNewNote();
    }
  };
  
  const selectNote = (id: string) => {
    // If there are unsaved changes, save them first
    if (isEdited) {
      saveCurrentNote();
    }
    setSelectedNoteId(id);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter notes based on search query
  const filteredNotes = searchQuery 
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;
  
  return (
    <div className="flex h-full bg-neutral-900 text-white">
      {/* Notes List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-2 flex justify-between items-center border-b border-white/10">
          <h3 className="font-medium">My Notes</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={createNewNote}
          >
            <FilePlus size={18} />
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="p-2 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notes..."
              className="pl-8 bg-black/20 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div 
                key={note.id}
                className={`
                  p-3 border-b border-white/10 cursor-pointer
                  ${note.id === selectedNoteId ? "bg-blue-900/30" : "hover:bg-white/5"}
                `}
                onClick={() => selectNote(note.id)}
              >
                <div className="font-medium truncate flex items-center gap-1">
                  {note.title}
                  {note.id === selectedNoteId && isEdited && (
                    <span className="text-amber-400 text-xs ml-1">(edited)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex justify-between mt-1">
                  <span>{formatDate(note.lastEdited)}</span>
                  <span className="truncate ml-2 text-gray-500">
                    {note.content.substring(0, 20)}
                    {note.content.length > 20 ? "..." : ""}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              {searchQuery ? "No matching notes found" : "No notes yet"}
            </div>
          )}
        </div>
      </div>
      
      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex items-center justify-between border-b border-white/10">
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Note title"
            className="text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-1 text-white"
          />
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={saveCurrentNote}
              disabled={!isEdited}
              className={isEdited ? "text-green-400" : "text-gray-500"}
            >
              {isEdited ? <Save size={18} /> : <Check size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={deleteCurrentNote}
              className="text-red-500 hover:text-red-400"
            >
              <Trash size={18} />
            </Button>
          </div>
        </div>
        
        <Textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          placeholder="Start typing..."
          className="flex-1 resize-none border-none rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-4 text-white"
        />
        
        <div className="p-2 flex justify-between items-center border-t border-white/10 bg-black/20 text-xs text-gray-400">
          <div>
            {currentContent.split(/\s+/).filter(Boolean).length} words | {currentContent.length} characters
          </div>
          <div>
            {isEdited ? "Edited" : "Saved"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
