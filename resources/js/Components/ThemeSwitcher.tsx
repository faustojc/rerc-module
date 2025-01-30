import { useTheme } from "@heroui/use-theme";
import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@/Components/Icons";
import { useEffect } from "react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
    }

    useEffect(() => {
        const localTheme = localStorage.getItem('heroui-theme');

        if (localTheme) {
            setTheme(localTheme);
        }
    }, [theme]);

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
