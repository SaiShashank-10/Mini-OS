
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setWaitingForOperand(false);
  };

  const clearAll = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(value !== 0 ? String(-value) : "0");
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    // Log operation in history
    if (nextOperator === "=" && operator) {
      const equation = `${storedValue || 0} ${operator} ${inputValue} = `;
      setHistory(prev => [equation, ...prev].slice(0, 10));
    }

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const currentValue = storedValue || 0;
      let newValue: number = 0;

      switch (operator) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "×":
          newValue = currentValue * inputValue;
          break;
        case "÷":
          if (inputValue === 0) {
            setDisplay("Error");
            setWaitingForOperand(true);
            setStoredValue(null);
            setOperator(null);
            return;
          }
          newValue = currentValue / inputValue;
          break;
        case "xⁿ":
          newValue = Math.pow(currentValue, inputValue);
          break;
        default:
          newValue = inputValue;
      }

      // Round to prevent floating point issues
      if (String(newValue).includes('.')) {
        const decimalPlaces = String(newValue).split('.')[1].length;
        if (decimalPlaces > 10) {
          newValue = parseFloat(newValue.toFixed(10));
        }
      }

      setStoredValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performSpecialOperation = (operation: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (operation) {
      case "sqrt":
        if (inputValue < 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.sqrt(inputValue);
        break;
      case "x²":
        result = inputValue * inputValue;
        break;
      case "1/x":
        if (inputValue === 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = 1 / inputValue;
        break;
      case "sin":
        result = Math.sin(inputValue * (Math.PI / 180)); // Convert degrees to radians
        break;
      case "cos":
        result = Math.cos(inputValue * (Math.PI / 180));
        break;
      case "tan":
        result = Math.tan(inputValue * (Math.PI / 180));
        break;
      case "log":
        if (inputValue <= 0) {
          setDisplay("Error");
          setWaitingForOperand(true);
          return;
        }
        result = Math.log10(inputValue);
        break;
      default:
        return;
    }

    // Round to prevent floating point issues
    if (String(result).includes('.')) {
      const decimalPlaces = String(result).split('.')[1].length;
      if (decimalPlaces > 10) {
        result = parseFloat(result.toFixed(10));
      }
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  // Standard calculator buttons
  const standardButtons = [
    ["MC", "MR", "M+", "M-"],
    ["C", "CE", "±", "%"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  // Scientific calculator buttons
  const scientificButtons = [
    ["sin", "cos", "tan", "log"],
    ["x²", "xⁿ", "√", "1/x"],
  ];

  const [showScientific, setShowScientific] = useState(false);

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "C":
        clearAll();
        break;
      case "CE":
        clearEntry();
        break;
      case "±":
        toggleSign();
        break;
      case "%":
        inputPercent();
        break;
      case "=":
        if (operator) {
          performOperation("=");
          setOperator(null);
          setStoredValue(null);
        }
        break;
      case "MC":
        memoryClear();
        break;
      case "MR":
        memoryRecall();
        break;
      case "M+":
        memoryAdd();
        break;
      case "M-":
        memorySubtract();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
      case "xⁿ":
        performOperation(value);
        break;
      case ".":
        inputDecimal();
        break;
      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "x²":
      case "√":
      case "1/x":
        performSpecialOperation(value);
        break;
      default:
        inputDigit(value);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-white overflow-hidden">
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowScientific(!showScientific)}
          className="text-white/70 hover:text-white text-xs"
        >
          {showScientific ? "Standard" : "Scientific"}
        </Button>
      </div>

      {/* Display history in scientific mode */}
      {showScientific && (
        <div className="bg-neutral-800 mx-4 p-2 rounded-t-md overflow-auto max-h-20">
          <div className="text-right text-white/60 text-xs font-mono">
            {history.map((eq, i) => (
              <div key={i}>{eq}</div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-neutral-800 mx-4 p-4 rounded-md mb-4">
        <div className="text-right text-white text-3xl font-mono h-8 overflow-hidden">
          {display}
        </div>
        <div className="text-right text-white/60 text-xs h-4">
          {operator && `${storedValue} ${operator}`}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div className="grid grid-cols-4 gap-2 h-full">
          {/* Scientific calculator buttons */}
          {showScientific && (
            <>
              {scientificButtons.map((row, rowIndex) => (
                <React.Fragment key={`sci-${rowIndex}`}>
                  {row.map((btn) => (
                    <Button
                      key={`sci-${rowIndex}-${btn}`}
                      className="p-2 h-12 text-sm bg-gray-700 hover:bg-gray-600"
                      onClick={() => handleButtonClick(btn)}
                    >
                      {btn}
                    </Button>
                  ))}
                </React.Fragment>
              ))}
            </>
          )}
          
          {/* Standard calculator buttons */}
          {standardButtons.map((row, rowIndex) =>
            row.map((btn, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                className={`
                  p-2 h-12 text-xl 
                  ${btn === "0" && !showScientific ? "col-span-2" : ""} 
                  ${["÷", "×", "-", "+", "="].includes(btn) ? "bg-orange-500 hover:bg-orange-600" : 
                    ["C", "CE", "±", "%", "MC", "MR", "M+", "M-"].includes(btn) ? "bg-gray-500 hover:bg-gray-600 text-black" : 
                    "bg-gray-600 hover:bg-gray-700"}
                `}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
