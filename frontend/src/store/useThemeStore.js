import { create } from "zustand";

const THEME_KEY = "chat-theme";
const DEFAULT_THEME = "coffee";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem(THEME_KEY) || DEFAULT_THEME,

  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.body && document.body.setAttribute("data-theme", theme);
    } catch (err) {
      // ignore when document is not available
    }
    set({ theme });
  },
}));

// Ensure the initial theme is applied to the <html> element so DaisyUI themes take effect
try {
  const initialTheme = useThemeStore.getState().theme || DEFAULT_THEME;
  try {
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.body && document.body.setAttribute("data-theme", initialTheme);
  } catch (err) {
    // document may be undefined in some SSR/test environments
  }
} catch (err) {
  // document may be undefined in some SSR/test environments
}