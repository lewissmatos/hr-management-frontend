import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "./tanstackQueryClient";
import { serviceGenerator } from "../services/services-generator";
import { Language } from "../../types/app-types";
const {
	onGet: onGetLanguages,
	onAdd: onAddLanguage,
	onUpdate: onUpdateLanguage,
	onToggleStatus: onToggleStatusLanguage,
} = serviceGenerator<Language>("languages");

export const useAddLanguage = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddLanguage,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-language"] });
		},
	});
};

export const useGetLanguages = () => {
	return useQuery({
		queryKey: ["get-languages"],
		queryFn: onGetLanguages,
	});
};

export const useUpdateLanguage = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Language>) =>
			onUpdateLanguage(data.id as number, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-language"] });
		},
	});
};

export const useToggleStatusLanguage = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusLanguage(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["toggle-status-language"] });
		},
	});
};
