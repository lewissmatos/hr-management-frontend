import { useEffect } from "react";
import { MagicIconButton } from "../ui";

const ThemeToggler = () => {
	const theme = "dark";
	const onChangeTheme = () => {};
	useEffect(() => {
		document.body.classList.remove("app-light", "app-dark");
		document.body.className = `app-${theme} text-foreground bg-background`;
	}, [theme]);
	return (
		<MagicIconButton
			onPress={onChangeTheme}
			variant="light"
			data-testid="theme-toggler-button"
			className="group hover:text-primary"
			size="sm"
		>
			{theme === "dark" ? "Light" : "Dark"}
		</MagicIconButton>
	);
};

export default ThemeToggler;
