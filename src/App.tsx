import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import AuthenticatedRoutes from "./router/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./router/UnauthenticatedRoutes";

function App() {
	const theme = "dark"; // This should be replaced with a state or context that manages the theme
	const isAuthenticated = false; // This should be replaced with a state or context that manages the authentication status
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
