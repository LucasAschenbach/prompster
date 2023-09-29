import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { listenForBackgroundPromptUpdates, getPrompts } from "../utils/message";
import { IPrompts } from "../shared/types";

type PromptContextType = {
  prompts: IPrompts;
};

const PromptContext = createContext<PromptContextType>({ prompts: {} });

export const usePromptContext = () => useContext(PromptContext);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [prompts, setPrompts] = useState<IPrompts>({});

  useEffect(() => {
    getPrompts().then((fetchedPrompts) => setPrompts(fetchedPrompts));

    const removeListener = listenForBackgroundPromptUpdates((updatedPrompts) => {
      setPrompts(updatedPrompts);
    });

    return () => {
      removeListener();
    };
  }, []);

  const value = useMemo(() => ({ prompts }), [prompts]);

  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
};
