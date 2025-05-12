import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "../service-hooks/tanstackQueryClient";
import { serviceGenerator } from "../services/services-generator";
import { Proficiency } from "../../types/app-types";
const {
	onGet: onGetProficiencies,
	onAdd: onAddProficiency,
	onUpdate: onUpdateProficiency,
	onToggleStatus: onToggleStatusProficiency,
} = serviceGenerator<Proficiency>("proficiencies");

export const useAddProficiency = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddProficiency,
		onSuccess: (data) => {
			console.log(data);
			qc.invalidateQueries({ queryKey: ["add-proficiency"] });
		},
	});
};

export const useGetProficiencies = () => {
	return useQuery({
		queryKey: ["get-proficiencies"],
		queryFn: onGetProficiencies,
	});
};

export const useUpdateProficiency = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Proficiency>) =>
			onUpdateProficiency(data.id as number, data),
		onSuccess: (data) => {
			console.log(data);
			qc.invalidateQueries({ queryKey: ["update-proficiency"] });
		},
	});
};

export const useToggleStatusProficiency = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusProficiency(id),
		onSuccess: (data) => {
			console.log(data);
			qc.invalidateQueries({ queryKey: ["toggle-status-proficiency"] });
		},
	});
};
