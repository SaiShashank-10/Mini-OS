
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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

  const toggleSign = () => {
    setDisplay(
      display.charAt(0) === "-" ? display.substring(1) : "-" + display
    );
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const currentValue = storedValue || 0;
      let newValue = 0;

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
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setStoredValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "C":
        clearAll();
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
      case "+":
      case "-":
      case "×":
      case "÷":
        performOperation(value);
        break;
      case ".":
        inputDecimal();
        break;
      default:
        inputDigit(value);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      <div className="bg-neutral-800 p-4 rounded-md mb-4">
        <div className="text-right text-white text-3xl font-mono h-8 overflow-hidden">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((row, rowIndex) =>
          row.map((btn, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              className={`
                p-2 h-12 text-xl 
                ${btn === "0" ? "col-span-2" : ""} 
                ${["÷", "×", "-", "+", "="].includes(btn) ? "bg-orange-500 hover:bg-orange-600" : 
                  ["C", "±", "%"].includes(btn) ? "bg-gray-400 hover:bg-gray-500 text-black" : 
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
  );
};

export default Calculator;
