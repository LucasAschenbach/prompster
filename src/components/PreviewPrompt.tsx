import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import KeyIcon from "./KeyIcon";
import { HiOutlineExternalLink } from "react-icons/hi";

interface Props {
  promptKey: string;
  prompt: string;
  onSubmit: (result: string) => void;
}

const PreviewPrompt: React.FC<Props> = ({ promptKey, prompt, onSubmit }) => {
  const [parts, setParts] = useState<
    { index: number; type: "input" | "text"; value: string }[]
  >([]);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [focusIndex, setFocusIndex] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newParts = prompt.split(/(\[[^\]]+\])/g);
    let indexPart = 0;
    let indexInput = 0;
    setParts(
      newParts.map((part) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return {
            index: indexInput++,
            type: "input",
            value: part.slice(1, -1),
          };
        } else {
          return { index: indexPart++, type: "text", value: part };
        }
      })
    );
    setVariables(
      newParts
        .filter((part) => part.startsWith("[") && part.endsWith("]"))
        .reduce((obj, key) => {
          obj[key.slice(1, -1)] = "";
          return obj;
        }, {} as { [key: string]: string })
    );
  }, [prompt]);

  useEffect(() => {
    // Set initial focus when component is mounted
    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    });
  }, []);

  useEffect(() => {
    inputRefs.current[focusIndex]?.focus();
  }, [focusIndex]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
          setFocusIndex(Math.max(0, focusIndex - 1));
        } else if (focusIndex < inputRefs.current.length - 1) {
          setFocusIndex(focusIndex + 1);
        } else {
          handleSubmit();
        }
        break;
      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;
      default:
        break;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const newVariables = { ...variables };
    newVariables[key] = e.target.value;
    setVariables(newVariables);
  };

  const handleSubmit = () => {
    const result = parts
      .map((part) => {
        if (part.type === "input") {
          return variables[part.value] || `[${part.value}]`;
        } else {
          return part.value;
        }
      })
      .join("");
    onSubmit(result);
  };

  return (
    <Card>
      <div className="flex h-full max-h-96 flex-col">
        <div className="flex flex-row items-center border-b border-zinc-700 p-4">
          <div className="text-base">/ {promptKey}</div>
          <div className="flex-grow" />
          <div className="text-sm text-gray-500">{`${focusIndex + 1} of ${
            parts.filter((part) => part.type === "input").length
          } variables`}</div>
        </div>
        <div className="overflow-y-auto px-4 py-6 leading-6 text-gray-500">
          {parts.map((part, index) => {
            if (part.type === "input") {
              const value = variables[part.value];
              return (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[part.index] = ref)}
                  type="text"
                  placeholder={part.value}
                  value={value}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => handleInputChange(e, part.value)}
                  className="focus:placeholder-zing-200 w-24 rounded border-none bg-zinc-900 px-1 text-zinc-300 focus:outline-2 focus:outline-offset-0 focus:outline-blue-600"
                />
              );
            } else {
              return <span key={index}>{part.value}</span>;
            }
          })}
        </div>
        <div className="flex flex-row items-center space-x-4 border-t border-zinc-700 px-4 py-2 text-sm text-gray-500">
          <span>
            <KeyIcon>Tab</KeyIcon> Next Input
          </span>
          <span>
            <KeyIcon>Enter</KeyIcon> Insert
          </span>
          <span>
            <KeyIcon>Esc</KeyIcon> Cancel
          </span>
          <div className="flex-grow" />
          <a
            href="https://github.com/lucasaschenbach/prompster/issues/new"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            Feedback <HiOutlineExternalLink className="inline" />
          </a>
        </div>
      </div>
    </Card>
  );
};

export default PreviewPrompt;
