import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { initLsm } from "react-lsm";
import esTranslations from "./settings/locales/es.json";

const LSMProvider = initLsm("es", {
	es: esTranslations,
});
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LSMProvider>
			<App />
			<Toaster />
		</LSMProvider>
	</StrictMode>
);
