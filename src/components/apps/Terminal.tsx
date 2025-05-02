
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface TerminalLine {
  type: "input" | "output";
  content: string;
}

const Terminal: React.FC = () => {
  const [commandHistory, setCommandHistory] = useState<TerminalLine[]>([
    { type: "output", content: "MiniOS Terminal [Version 1.0.0]" },
    { type: "output", content: "(c) 2025 Lovable Corporation. All rights reserved." },
    { type: "output", content: "" },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when content changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  useEffect(() => {
    // Auto focus on input when terminal is rendered
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    
    // Record the command
    const newHistory = [...commandHistory, { type: "input" as const, content: `> ${cmd}` }];
    
    if (command === "") {
      setCommandHistory([...newHistory, { type: "output" as const, content: "" }]);
      return;
    }
    
    // Process command
    switch (command) {
      case "help":
        setCommandHistory([
          ...newHistory,
          { type: "output", content: "Available commands:" },
          { type: "output", content: "help     - Show this help message" },
          { type: "output", content: "clear    - Clear the terminal" },
          { type: "output", content: "date     - Display current date and time" },
          { type: "output", content: "echo     - Echo a message" },
          { type: "output", content: "whoami   - Display current user" },
          { type: "output", content: "ls       - List files in current directory" },
          { type: "output", content: "version  - Show system version" },
          { type: "output", content: "exit     - Close the terminal" },
          { type: "output", content: "" },
        ]);
        break;
        
      case "clear":
        setCommandHistory([]);
        break;
        
      case "date":
        setCommandHistory([
          ...newHistory,
          { type: "output", content: new Date().toString() },
          { type: "output", content: "" },
        ]);
        break;
        
      case "whoami":
        setCommandHistory([
          ...newHistory,
          { type: "output", content: "user@minios" },
          { type: "output", content: "" },
        ]);
        break;
        
      case "ls":
        setCommandHistory([
          ...newHistory,
          { type: "output", content: "Documents/" },
          { type: "output", content: "Pictures/" },
          { type: "output", content: "Downloads/" },
          { type: "output", content: "README.txt" },
          { type: "output", content: "config.json" },
          { type: "output", content: "" },
        ]);
        break;
        
      case "version":
        setCommandHistory([
          ...newHistory,
          { type: "output", content: "MiniOS Terminal [Version 1.0.0]" },
          { type: "output", content: "" },
        ]);
        break;
        
      default:
        if (command.startsWith("echo ")) {
          const message = cmd.substring(5);
          setCommandHistory([
            ...newHistory,
            { type: "output", content: message },
            { type: "output", content: "" },
          ]);
        } else {
          setCommandHistory([
            ...newHistory,
            { type: "output", content: `Command not recognized: ${command}` },
            { type: "output", content: "Type 'help' for a list of commands." },
            { type: "output", content: "" },
          ]);
        }
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-app-terminal text-app-terminal-foreground font-mono p-1 overflow-hidden"
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto whitespace-pre-wrap pb-2"
      >
        {commandHistory.map((line, index) => (
          <div key={index} className={line.type === "input" ? "pl-0" : "pl-0"}>
            {line.content}
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <span className="text-green-500 mr-2">&gt;</span>
        <Input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-6 text-app-terminal-foreground"
        />
      </div>
    </div>
  );
};

export default Terminal;
