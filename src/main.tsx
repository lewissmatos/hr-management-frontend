import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { initLsm } from "react-lsm";
import esTranslations from "./settings/locales/es.json";
import { QueryClientProvider } from "@tanstack/react-query";
import getQueryClient from "./features/service-hooks/tanstackQueryClient.ts";

const LSMProvider = initLsm("es", {
	es: esTranslations,
});
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LSMProvider>
			<QueryClientProvider client={getQueryClient()}>
				<App />
				<Toaster position="bottom-right" />
			</QueryClientProvider>
		</LSMProvider>
	</StrictMode>
);
