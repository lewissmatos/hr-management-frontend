import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "./tanstackQueryClient";
import { serviceGenerator } from "../services/services-generator";
import { Candidate } from "../../types/app-types";
const {
	onGet: onGetCandidates,
	onGetSingle: onGetCandidate,
	onAdd: onAddCandidate,
	onUpdate: onUpdateCandidate,
	onToggleStatus: onToggleStatusCandidate,
} = serviceGenerator<Candidate>("candidates");

export const useAddCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddCandidate,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-candidate"] });
		},
	});
};

export const useGetCandidates = (filters?: Record<string, any>) => {
	return {
		...useQuery({
			queryKey: ["get-candidates", filters],
			queryFn: () => onGetCandidates(filters),
		}),
		filters,
	};
};

export const useGetCandidate = (id: number) => {
	return useQuery({
		queryKey: [`get-candidate-${id}`],
		queryFn: () => onGetCandidate(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};
export const useUpdateCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Candidate>) =>
			onUpdateCandidate(data.id as number, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-candidate"] });
		},
	});
};

export const useToggleStatusCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusCandidate(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["toggle-candidate-status"] });
		},
	});
};
