import axiosInstance from "./axios-instance";
import { ApiResponse } from "../service-hooks/service-types";

export const serviceGenerator = <T>(entity: string) => {
	const onGet = async () => {
		return await axiosInstance.get<ApiResponse<T[]>>(`/${entity}`);
	};

	const onAdd = async (body: Partial<T>) => {
		return await axiosInstance.post<ApiResponse<T>>(`/${entity}`, body);
	};

	const onUpdate = async (id: number, body: Partial<T>) => {
		return await axiosInstance.patch<ApiResponse<T>>(`/${entity}/${id}`, body);
	};

	const onToggleStatus = async (id: number) => {
		return await axiosInstance.patch<ApiResponse<T>>(
			`/${entity}/${id}/toggle-status`
		);
	};

	return { onGet, onAdd, onUpdate, onToggleStatus };
};
