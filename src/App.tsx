import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import AuthenticatedRoutes from "./router/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./router/UnauthenticatedRoutes";
import useAuthStore from "./features/store/auth-store";
import usePreferencesStore from "./features/store/preferences-store";

function App() {
	const theme = usePreferencesStore((state) => state.theme);
	const { isAuthenticated } = useAuthStore((state) => state);

	return (
		<BrowserRouter>
			<HeroUIProvider>
				<main
					className={`app-${theme} text-foreground bg-background p-0 transition-all duration-100 selection:bg-primary-200 selection:text-primary-600`}
				>
					{isAuthenticated ? (
						<main className={`app-${theme}`}>
							<AuthenticatedRoutes />
						</main>
					) : (
						<main className={`app-dark`}>
							<UnauthenticatedRoutes />
						</main>
					)}
				</main>
			</HeroUIProvider>
		</BrowserRouter>
	);
}

export default App;
