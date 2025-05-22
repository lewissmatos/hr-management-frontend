import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "./tanstackQueryClient";
import { serviceGenerator } from "../services/services-generator";
import { Employee } from "../../types/app-types";
import axiosInstance from "../services/axios-instance";
const {
	onGet: onGetEmployees,
	onGetSingle: onGetEmployee,
	onAdd: onAddEmployee,
	onUpdate: onUpdateEmployee,
	onToggleStatus: onToggleStatusEmployee,
} = serviceGenerator<Employee>("employees");

export const useAddEmployee = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddEmployee,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-employee"] });
		},
	});
};

export const useGetEmployees = (filters?: Record<string, any>) => {
	return {
		...useQuery({
			queryKey: ["get-employees", filters],
			queryFn: () => onGetEmployees(filters),
		}),
		filters,
	};
};
export const useGetEmployeesToExport = ({
	startDate,
	endDate,
}: {
	startDate: string;
	endDate: string;
}) => {
	return {
		...useQuery({
			queryKey: ["get-employees", startDate, endDate],
			queryFn: async () => {
				const res = await axiosInstance.get(
					`/employees/export?startDate=${startDate}&endDate=${endDate}`
				);
				return res.data;
			},
			enabled: Boolean(startDate && endDate),
		}),
	};
};

export const useGetEmployee = (id: number) => {
	return useQuery({
		queryKey: [`get-employee-${id}`],
		queryFn: () => onGetEmployee(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};
export const useUpdateEmployee = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Employee>) =>
			onUpdateEmployee(data.id as number, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-employee"] });
		},
	});
};

export const useToggleStatusEmployee = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusEmployee(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["toggle-employee-status"] });
		},
	});
};
