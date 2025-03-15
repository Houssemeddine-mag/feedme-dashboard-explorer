
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SettingsContextType = {
  theme: "light" | "dark" | "system";
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setTimeZone: (timeZone: string) => void;
  setDateFormat: (dateFormat: string) => void;
  setTimeFormat: (timeFormat: string) => void;
  setCurrency: (currency: string) => void;
};

const defaultSettings: SettingsContextType = {
  theme: "light",
  language: "en",
  timeZone: "UTC+1",
  dateFormat: "EEEE, MMMM d, yyyy",
  timeFormat: "HH:mm:ss",
  currency: "DZD",
  setTheme: () => {},
  setLanguage: () => {},
  setTimeZone: () => {},
  setDateFormat: () => {},
  setTimeFormat: () => {},
  setCurrency: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Try to load settings from local storage or use defaults
  const [settings, setSettings] = useState<SettingsContextType>(() => {
    const savedSettings = localStorage.getItem("feedmeSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("feedmeSettings", JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings]);

  const setTheme = (theme: "light" | "dark" | "system") => {
    setSettings({ ...settings, theme });
  };

  const setLanguage = (language: string) => {
    setSettings({ ...settings, language });
  };

  const setTimeZone = (timeZone: string) => {
    setSettings({ ...settings, timeZone });
  };

  const setDateFormat = (dateFormat: string) => {
    setSettings({ ...settings, dateFormat });
  };

  const setTimeFormat = (timeFormat: string) => {
    setSettings({ ...settings, timeFormat });
  };

  const setCurrency = (currency: string) => {
    setSettings({ ...settings, currency });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setLanguage,
        setTimeZone,
        setDateFormat,
        setTimeFormat,
        setCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
