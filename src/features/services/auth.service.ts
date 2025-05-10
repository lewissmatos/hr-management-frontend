import { User } from "../../types/app-types";
import axiosInstance from "../axios-instance";

export type LoginPayload = {
	username: string;
	password: string;
};

export type LoginResponse = {
	user: User;
	token: string;
};
export const onLogin = async (data: LoginPayload) =>
	await axiosInstance.post<LoginResponse>("/auth/login", data);
