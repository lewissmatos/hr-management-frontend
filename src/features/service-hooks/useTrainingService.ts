import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "./tanstackQueryClient";
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
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddTraining,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-training"] });
		},
	});
};

export const useGetTrainings = () => {
	return useQuery({
		queryKey: ["get-trainings"],
		queryFn: onGetTrainings,
	});
};

export const useGetTraining = (id: number) => {
	return useQuery({
		queryKey: [`get-training-${id}`],
		queryFn: () => onGetTraining(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};
export const useUpdateTraining = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Training>) =>
			onUpdateTraining(data.id as number, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-training"] });
		},
	});
};

export const useToggleStatusTraining = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusTraining(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["toggle-training-status"] });
		},
	});
};
