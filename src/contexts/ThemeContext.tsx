
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Layout = "default" | "compact" | "expanded";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  layoutType: Layout;
  setLayoutType: (layout: Layout) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "light";
  });
  
  const [layoutType, setLayoutType] = useState<Layout>(() => {
    const savedLayout = localStorage.getItem("layoutType");
    return (savedLayout as Layout) || "default";
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Apply theme to the document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("layoutType", layoutType);
  }, [layoutType]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, layoutType, setLayoutType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
