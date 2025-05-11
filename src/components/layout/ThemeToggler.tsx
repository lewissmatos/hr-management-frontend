import { useEffect } from "react";
import { MagicIconButton } from "../ui";
import usePreferencesStore from "../../features/store/preferences-store";
import { Moon, SunDim } from "lucide-react";

const ThemeToggler = () => {
	const { theme, toggleTheme } = usePreferencesStore();

	useEffect(() => {
		document.body.classList.remove("app-light", "app-dark");
		document.body.className = `app-${theme} text-foreground bg-background`;
	}, [theme]);
	return (
		<MagicIconButton
			onPress={toggleTheme}
			variant="light"
			data-testid="theme-toggler-button"
			className="group hover:text-yellow-500 transition-all duration-200"
			size="sm"
		>
			{theme === "light" ? <SunDim /> : <Moon />}
		</MagicIconButton>
	);
};

export default ThemeToggler;
