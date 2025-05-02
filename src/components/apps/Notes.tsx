
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, FilePlus, Trash } from "lucide-react";

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
  
  // Initialize with a blank note if none exist
  useEffect(() => {
    if (notes.length === 0) {
      createNewNote();
    } else {
      setSelectedNoteId(notes[0].id);
      setCurrentTitle(notes[0].title);
      setCurrentContent(notes[0].content);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update UI when selecting a different note
  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        setCurrentTitle(note.title);
        setCurrentContent(note.content);
      }
    }
  }, [selectedNoteId, notes]);
  
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
  };
  
  const deleteCurrentNote = () => {
    if (!selectedNoteId) return;
    
    const newNotes = notes.filter(note => note.id !== selectedNoteId);
    setNotes(newNotes);
    
    if (newNotes.length > 0) {
      setSelectedNoteId(newNotes[0].id);
    } else {
      createNewNote();
    }
  };
  
  const selectNote = (id: string) => {
    saveCurrentNote();
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
        
        <div className="flex-1 overflow-auto">
          {notes.map((note) => (
            <div 
              key={note.id}
              className={`
                p-3 border-b border-white/10 cursor-pointer
                ${note.id === selectedNoteId ? "bg-blue-900/30" : "hover:bg-white/5"}
              `}
              onClick={() => selectNote(note.id)}
            >
              <div className="font-medium truncate">{note.title}</div>
              <div className="text-xs text-gray-400 flex justify-between mt-1">
                <span>{formatDate(note.lastEdited)}</span>
                <span className="truncate ml-2 text-gray-500">
                  {note.content.substring(0, 20)}
                  {note.content.length > 20 ? "..." : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex items-center justify-between border-b border-white/10">
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Note title"
            className="text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-1"
          />
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={saveCurrentNote}
            >
              <Save size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={deleteCurrentNote}
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
      </div>
    </div>
  );
};

export default Notes;
