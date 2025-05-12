import { User } from "../../types/app-types";
import axiosInstance from "./axios-instance";
import { ApiResponse } from "../service-hooks/service-types";

export type LoginPayload = {
	username: string;
	password: string;
};

export type LoginResponse = {
	user: User;
	token: string;
};
export const onLogin = async (data: LoginPayload) =>
	await axiosInstance.post<ApiResponse<LoginResponse>>("/auth/login", data);
