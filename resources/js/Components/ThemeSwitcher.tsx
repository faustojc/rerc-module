import { Theme } from "@heroui/use-theme";
import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@/Components/Icons";
import { useEffect } from "react";
import { useThemeSignal } from "@/types/themeSignal";

export const ThemeSwitcher = () => {
    const { theme, changeTheme } = useThemeSignal();

    const handleThemeChange = () => {
        const newTheme: Theme = theme === "dark" ? "light" : "dark";

        changeTheme(newTheme);
        document.documentElement.className = newTheme;
    };

    useEffect(() => {
        const localTheme = localStorage.getItem("heroui-theme") as Theme | null;

        changeTheme(localTheme ?? 'light');
    }, []);

    return (
        <Switch
            color="primary"
            size="md"
            startContent={<MoonIcon />}
            endContent={<SunIcon />}
            isSelected={theme === 'dark'}
            onValueChange={(_) => handleThemeChange()}
        />
    )
};
