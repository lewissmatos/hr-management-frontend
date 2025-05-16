import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Candidate } from "../../types/app-types";

interface AuthStore {
	hasCandidate: boolean;
	candidateData: Candidate | null;
	saveInfo: (user: Candidate) => void;
	clearInfo: () => void;
}

const useApplyingCandidateStore = create<AuthStore>()(
	persist(
		(set) => ({
			hasCandidate: false,
			candidateData: null,
			saveInfo: (candidateData: Candidate) => {
				return set({ hasCandidate: true, candidateData });
			},
			clearInfo: () => {
				localStorage.removeItem("token");
				return set({ hasCandidate: false, candidateData: null });
			},
		}),
		{ name: "applying-candidate-store" }
	)
);

export default useApplyingCandidateStore;
