import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceGenerator } from "../services/services-generator";
import { Language } from "../../types/app-types";
const {
	onGet: onGetLanguages,
	onAdd: onAddLanguage,
	onUpdate: onUpdateLanguage,
	onToggleStatus: onToggleStatusLanguage,
} = serviceGenerator<Language>("languages");

export const useAddLanguage = () => {
	return useMutation({
		mutationFn: onAddLanguage,
	});
};

export const useGetLanguages = () => {
	return useQuery({
		queryKey: ["get-languages"],
		queryFn: onGetLanguages,
	});
};

export const useUpdateLanguage = () => {
	return useMutation({
		mutationFn: (data: Partial<Language>) =>
			onUpdateLanguage(data.id as number, data),
	});
};

export const useToggleStatusLanguage = () => {
	return useMutation({
		mutationFn: (id: number) => onToggleStatusLanguage(id),
	});
};
