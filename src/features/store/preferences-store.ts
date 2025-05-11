import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesStore {
	theme: "dark" | "light";
	setTheme: (theme: "dark" | "light") => void;
	toggleTheme: () => void;
}

const usePreferencesStore = create<PreferencesStore>()(
	persist(
		(set) => ({
			theme: "light",
			setTheme: (theme: "dark" | "light") => set({ theme }),
			toggleTheme: () =>
				set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
		}),
		{ name: "auth-store" }
	)
);

export default usePreferencesStore;
