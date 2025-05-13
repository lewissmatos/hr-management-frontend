import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceGenerator } from "../services/services-generator";
import { JobPosition } from "../../types/app-types";
import axiosInstance from "../services/axios-instance";
import toast from "react-hot-toast";
import { useState } from "react";

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

export const useGetJobPositions = () => {
	const [filters, setFilters] = useState<Record<string, any>>({});
	return {
		...useQuery({
			queryKey: ["get-job-positions", filters],
			queryFn: () => onGetJobPositions(filters),
		}),
		setFilters,
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
