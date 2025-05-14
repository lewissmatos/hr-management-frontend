import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceGenerator } from "../services/services-generator";
import { Training } from "../../types/app-types";
const {
	onGet: onGetTrainings,
	onGetSingle: onGetTraining,
	onAdd: onAddTraining,
	onUpdate: onUpdateTraining,
	onToggleStatus: onToggleStatusTraining,
} = serviceGenerator<Training>("trainings");

export const useAddTraining = () => {
	return useMutation({
		mutationFn: onAddTraining,
	});
};

export const useGetTrainings = (filters?: Record<string, any>) => {
	return {
		...useQuery({
			queryKey: ["get-trainings", filters],
			queryFn: () => onGetTrainings(filters),
		}),
		filters,
	};
};

export const useGetTraining = (id: number) => {
	return useQuery({
		queryKey: [`get-training-${id}`, id],
		queryFn: () => onGetTraining(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};
export const useUpdateTraining = () => {
	return useMutation({
		mutationFn: (data: Partial<Training>) =>
			onUpdateTraining(data.id as number, data),
	});
};

export const useToggleStatusTraining = () => {
	return useMutation({
		mutationFn: (id: number) => onToggleStatusTraining(id),
	});
};
