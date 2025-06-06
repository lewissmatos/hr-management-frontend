import { useMutation, useQuery } from "@tanstack/react-query";
import getQueryClient from "./tanstackQueryClient";
import { serviceGenerator } from "../services/services-generator";
import { Candidate } from "../../types/app-types";
import axiosInstance from "../services/axios-instance";
import axios from "axios";
const {
	onGet: onGetCandidates,
	onGetSingle: onGetCandidate,
	onAdd: onAddCandidate,
	onUpdate: onUpdateCandidate,
	onToggleStatus: onToggleStatusCandidate,
} = serviceGenerator<Candidate>("candidates");

export const useAddCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: onAddCandidate,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-candidate"] });
		},
	});
};
export const useCheckCandidatePassword = () => {
	const qc = getQueryClient();

	return useMutation({
		mutationFn: async ({
			cedula,
			password,
		}: {
			cedula: string;
			password: string;
		}) => {
			const res = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/candidates/check-password`,
				{
					password,
					cedula,
				}
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["add-candidate"] });
		},
	});
};

export const useGetCandidates = (filters?: Record<string, any>) => {
	return {
		...useQuery({
			queryKey: ["get-candidates", filters],
			queryFn: () => onGetCandidates(filters),
		}),
		filters,
	};
};

export const useGetCandidatesByPosition = ({
	jobPositionId,
}: {
	jobPositionId: number;
}) => {
	return {
		...useQuery({
			queryKey: ["get-candidates-by-position", jobPositionId],
			queryFn: async () =>
				(await axiosInstance.get(`candidates/job-position/${jobPositionId}`))
					.data,
		}),
	};
};

export const useGetCandidate = (id: number) => {
	return useQuery({
		queryKey: [`get-candidate-${id}`],
		queryFn: () => onGetCandidate(id),
		enabled: Boolean(id),
		refetchOnMount: true,
	});
};

export const onGetCandidateByCedula = async (cedula: string) => {
	let res = "";
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/candidates/${cedula}/cedula`
		);
		res = response?.data?.message;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				res = "NO_MATTER";
			} else {
				console.error("Error fetching candidate by cedula:", error);
			}
		} else {
			console.error("Unexpected error:", error);
		}
	}

	return res;
};

export const useUpdateCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (data: Partial<Candidate>) =>
			onUpdateCandidate(data.id as number, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-candidate"] });
		},
	});
};

export const useMakeCandidateEmployee = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: async ({ id, salary }: { id: number; salary?: number }) =>
			(
				await axiosInstance.put(`candidates/${id}/make-employee`, {
					salary,
				})
			).data,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["update-candidate"] });
		},
	});
};

export const useToggleStatusCandidate = () => {
	const qc = getQueryClient();
	return useMutation({
		mutationFn: (id: number) => onToggleStatusCandidate(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["toggle-candidate-status"] });
		},
	});
};
