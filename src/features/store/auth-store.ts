import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../../types/app-types";

interface AuthStore {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	login: (user: User, token: string) => void;
	logout: () => void;
}

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			user: null,
			token: null,
			login: (user: User, token: string) => {
				localStorage.setItem("token", token);
				return set({ isAuthenticated: true, user, token });
			},
			logout: () => {
				localStorage.removeItem("token");
				return set({ isAuthenticated: false, user: null, token: null });
			},
		}),
		{ name: "auth-store" }
	)
);

export default useAuthStore;
