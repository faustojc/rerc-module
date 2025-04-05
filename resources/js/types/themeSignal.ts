import { Theme } from "@heroui/use-theme";
import { useCallback, useEffect, useState } from "react";

export type ThemeChangeCallback = (newTheme: Theme) => void;

let currentTheme: Theme = (localStorage.getItem("heroui-theme") as Theme) || "light";

const listeners: Set<ThemeChangeCallback> = new Set();

export const getCurrentTheme = (): Theme => currentTheme;

export const setCurrentTheme = (theme: Theme): void => {
    currentTheme = theme;
    localStorage.setItem("heroui-theme", theme);
    listeners.forEach((callback: ThemeChangeCallback) => callback(theme));
};

export const subscribeTheme = (callback: ThemeChangeCallback): (() => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

// A custom hook that uses the theme signal.
// It returns the current theme and a function to change it.
export function useThemeSignal(): { theme: Theme; changeTheme: (newTheme: Theme) => void } {
    const [theme, setTheme] = useState(getCurrentTheme());

    useEffect(() => {
        return subscribeTheme((newTheme: Theme) => {
            setTheme(newTheme);
        });
    }, []);

    const changeTheme = useCallback((newTheme: Theme) => {
        setCurrentTheme(newTheme);
    }, []);

    return { theme, changeTheme };
}
