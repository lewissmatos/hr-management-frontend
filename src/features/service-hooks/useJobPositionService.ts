import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceGenerator } from "../services/services-generator";
import { JobPosition } from "../../types/app-types";
import axiosInstance from "../services/axios-instance";
import toast from "react-hot-toast";

const {
	onGet: onGetJobPositions,
	onGetSingle: onGetJobPosition,
	onAdd: onAddJobPosition,
	onUpdate: onUpdateJobPosition,
} = serviceGenerator<JobPosition>("job-positions");

export const useAddJobPosition = () => {
	return useMutation({
		mutationFn: onAddJobPosition,
	});
};

export const useGetJobPositions = (filters?: Record<string, any>) => {
	return {
		...useQuery({
			queryKey: ["get-job-positions", filters],
			queryFn: () => onGetJobPositions(filters),
		}),
		filters,
	};
};

export const useGetJobPosition = (id: number) => {
	return useQuery({
		queryKey: [`get-job-position-${id}`, id],
		queryFn: () => onGetJobPosition(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};
export const useUpdateJobPosition = () => {
	return useMutation({
		mutationFn: (data: Partial<JobPosition>) =>
			onUpdateJobPosition(data.id as number, data),
	});
};

export const useToggleJobPositionAvailability = () => {
	return useMutation({
		mutationFn: (id: number) =>
			axiosInstance.put(`job-positions/${id}/toggle-availability`),
		onSuccess: () => {
			toast.success("Puesto de trabajo actualizado");
		},
	});
};

export const useGetJobPositionCandidatesCount = (id: number) => {
	return {
		...useQuery({
			queryKey: ["get-job-positions-candidates-count", id],
			queryFn: async () =>
				(await axiosInstance.get(`job-positions/${id}/candidates-count`)).data,
		}),
	};
};
