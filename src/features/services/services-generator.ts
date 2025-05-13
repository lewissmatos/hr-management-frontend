import axiosInstance from "./axios-instance";
import { ApiResponse } from "../service-hooks/service-types";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";

export const serviceGenerator = <T>(entity: string) => {
	const onGet = async (filters?: Record<string, any>) => {
		const parsedParams = new URLSearchParams(filters).toString();
		const url = parsedParams ? `/${entity}?${parsedParams}` : `/${entity}`;
		return (await axiosInstance.get<ApiResponse<T[]>>(url)).data;
	};
	const onGetSingle = async (id: number) => {
		return (await axiosInstance.get<ApiResponse<T>>(`/${entity}/${id}`)).data;
	};

	const onAdd = async (body: Partial<T>) => {
		return toastHandler(
			await axiosInstance.post<ApiResponse<T>>(`/${entity}`, body)
		);
	};

	const onUpdate = async (id: number, body: Partial<T>) => {
		return toastHandler(
			await axiosInstance.put<ApiResponse<T>>(`/${entity}/${id}`, body)
		);
	};

	const onToggleStatus = async (id: number) => {
		return toastHandler(
			await axiosInstance.patch<ApiResponse<T>>(
				`/${entity}/${id}/toggle-status`
			)
		);
	};

	const toastHandler = async <T>(response: AxiosResponse<ApiResponse<T>>) => {
		if (response.status === 200) {
			toast.success(response.data.message);
		}
		return response;
	};

	return { onGet, onGetSingle, onAdd, onUpdate, onToggleStatus };
};
