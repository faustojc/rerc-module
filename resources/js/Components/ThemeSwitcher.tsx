import { useTheme } from "@heroui/use-theme";
import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@/Components/Icons";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <Switch
            color="primary"
            size="md"
            startContent={<MoonIcon />}
            endContent={<SunIcon />}
            onValueChange={(_) => handleThemeChange()}
        />
    )
};
