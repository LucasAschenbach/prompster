import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { ISettings } from "../shared/types";
import { listenForBackgroundSettingsUpdates, getSettings } from "../utils/message";
import defaultSettingsJson from "../../static/default_settings.json";

const defaultSettings = defaultSettingsJson as ISettings;

type SettingsContextType = {
  settings: ISettings;
};

const SettingsContext = createContext<SettingsContextType>({ settings: defaultSettings });

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ISettings>(defaultSettings);

  useEffect(() => {
    getSettings().then((fetchedSettings) => setSettings(fetchedSettings));

    const removeListener = listenForBackgroundSettingsUpdates((updatedSettings) => {
      setSettings(updatedSettings);
    });

    return () => {
      removeListener();
    };
  }, []);

  const value = useMemo(() => ({ settings }), [settings]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};
