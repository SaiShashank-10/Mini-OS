
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
  const [commandBuffer, setCommandBuffer] = useState<string[]>([]);
  const [bufferIndex, setBufferIndex] = useState(-1);
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
    
    // Save command to buffer if not empty
    if (command !== "" && (commandBuffer.length === 0 || commandBuffer[commandBuffer.length - 1] !== command)) {
      setCommandBuffer(prev => [...prev, command]);
      setBufferIndex(-1);
    }
    
    if (command === "") {
      setCommandHistory([...newHistory, { type: "output" as const, content: "" }]);
      return;
    }
    
    // Process command
    if (command.includes(" ")) {
      const [mainCommand, ...args] = command.split(" ");
      processComplexCommand(newHistory, mainCommand, args);
    } else {
      processSimpleCommand(newHistory, command);
    }
  };

  const processSimpleCommand = (newHistory: TerminalLine[], command: string) => {
    switch (command) {
      case "help":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: "Available commands:" },
          { type: "output" as const, content: "help     - Show this help message" },
          { type: "output" as const, content: "clear    - Clear the terminal" },
          { type: "output" as const, content: "date     - Display current date and time" },
          { type: "output" as const, content: "echo     - Echo a message" },
          { type: "output" as const, content: "whoami   - Display current user" },
          { type: "output" as const, content: "ls       - List files in current directory" },
          { type: "output" as const, content: "cat      - Display file contents" },
          { type: "output" as const, content: "mkdir    - Create a new directory" },
          { type: "output" as const, content: "notes    - Show saved notes" },
          { type: "output" as const, content: "calc     - Simple calculator (e.g. calc 2+2)" },
          { type: "output" as const, content: "weather  - Show current weather" },
          { type: "output" as const, content: "version  - Show system version" },
          { type: "output" as const, content: "history  - Show command history" },
          { type: "output" as const, content: "exit     - Close the terminal" },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "clear":
        setCommandHistory([]);
        break;
        
      case "date":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: new Date().toString() },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "whoami":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: "user@minios" },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "ls":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: "Documents/" },
          { type: "output" as const, content: "Pictures/" },
          { type: "output" as const, content: "Downloads/" },
          { type: "output" as const, content: "Notes/" },
          { type: "output" as const, content: "README.txt" },
          { type: "output" as const, content: "config.json" },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "version":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: "MiniOS Terminal [Version 1.0.0]" },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "history":
        const cmdHistory = commandBuffer.map((cmd, i) => `${i + 1}: ${cmd}`);
        setCommandHistory([
          ...newHistory,
          ...(cmdHistory.length > 0 
            ? cmdHistory.map(cmd => ({ type: "output" as const, content: cmd }))
            : [{ type: "output" as const, content: "No command history" }]),
          { type: "output" as const, content: "" },
        ]);
        break;

      case "notes":
        // Attempt to get notes from localStorage
        try {
          const savedNotes = localStorage.getItem('miniOS-notes');
          const notes = savedNotes ? JSON.parse(savedNotes) : [];
          
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: "Saved Notes:" },
            ...(notes.length > 0 
              ? notes.map((note: any) => ({ 
                  type: "output" as const, 
                  content: `${note.title} - Last edited: ${new Date(note.lastEdited).toLocaleString()}`
                }))
              : [{ type: "output" as const, content: "No notes saved" }]),
            { type: "output" as const, content: "" },
          ]);
        } catch (e) {
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: "Error retrieving notes" },
            { type: "output" as const, content: "" },
          ]);
        }
        break;
        
      case "weather":
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: "Weather Forecast:" },
          { type: "output" as const, content: "Location: San Francisco, CA" },
          { type: "output" as const, content: "Temperature: 68°F / 20°C" },
          { type: "output" as const, content: "Conditions: Partly Cloudy" },
          { type: "output" as const, content: "Humidity: 75%" },
          { type: "output" as const, content: "(Note: This is simulated weather data)" },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      default:
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: `Command not recognized: ${command}` },
          { type: "output" as const, content: "Type 'help' for a list of commands." },
          { type: "output" as const, content: "" },
        ]);
        break;
    }
  };

  const processComplexCommand = (newHistory: TerminalLine[], mainCommand: string, args: string[]) => {
    switch (mainCommand) {
      case "echo":
        const message = args.join(" ");
        setCommandHistory([
          ...newHistory,
          { type: "output" as const, content: message },
          { type: "output" as const, content: "" },
        ]);
        break;
        
      case "calc":
        try {
          // Simple calculator that evaluates expressions
          const expression = args.join("");
          // Use Function constructor to evaluate the expression
          // eslint-disable-next-line no-new-func
          const result = new Function(`return ${expression}`)();
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: `${expression} = ${result}` },
            { type: "output" as const, content: "" },
          ]);
        } catch (e) {
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: "Error: Invalid expression" },
            { type: "output" as const, content: "" },
          ]);
        }
        break;
        
      case "cat":
        if (args.length === 0) {
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: "Usage: cat <filename>" },
            { type: "output" as const, content: "" },
          ]);
        } else {
          const filename = args[0];
          if (filename === "readme.txt") {
            setCommandHistory([
              ...newHistory,
              { type: "output" as const, content: "=== README.txt ===" },
              { type: "output" as const, content: "Welcome to MiniOS!" },
              { type: "output" as const, content: "This is a web-based operating system simulation." },
              { type: "output" as const, content: "Explore the various apps and features!" },
              { type: "output" as const, content: "" },
            ]);
          } else if (filename === "config.json") {
            setCommandHistory([
              ...newHistory,
              { type: "output" as const, content: "=== config.json ===" },
              { type: "output" as const, content: '{' },
              { type: "output" as const, content: '  "version": "1.0.0",' },
              { type: "output" as const, content: '  "theme": "dark",' },
              { type: "output" as const, content: '  "username": "user"' },
              { type: "output" as const, content: '}' },
              { type: "output" as const, content: "" },
            ]);
          } else {
            setCommandHistory([
              ...newHistory,
              { type: "output" as const, content: `File not found: ${filename}` },
              { type: "output" as const, content: "" },
            ]);
          }
        }
        break;
        
      case "mkdir":
        if (args.length === 0) {
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: "Usage: mkdir <directory_name>" },
            { type: "output" as const, content: "" },
          ]);
        } else {
          const dirname = args[0];
          setCommandHistory([
            ...newHistory,
            { type: "output" as const, content: `Directory created: ${dirname}` },
            { type: "output" as const, content: "(Note: This is a simulation, no actual directory is created)" },
            { type: "output" as const, content: "" },
          ]);
        }
        break;
        
      default:
        processSimpleCommand(newHistory, mainCommand);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
      setCurrentCommand("");
    } else if (e.key === "ArrowUp") {
      // Navigate command history
      e.preventDefault();
      if (commandBuffer.length > 0) {
        const newIndex = bufferIndex < commandBuffer.length - 1 ? bufferIndex + 1 : bufferIndex;
        setBufferIndex(newIndex);
        setCurrentCommand(commandBuffer[commandBuffer.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      // Navigate command history
      e.preventDefault();
      if (bufferIndex > 0) {
        const newIndex = bufferIndex - 1;
        setBufferIndex(newIndex);
        setCurrentCommand(commandBuffer[commandBuffer.length - 1 - newIndex] || "");
      } else if (bufferIndex === 0) {
        setBufferIndex(-1);
        setCurrentCommand("");
      }
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
          <div key={index} className={line.type === "input" ? "text-cyan-300" : "text-app-terminal-foreground"}>
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
