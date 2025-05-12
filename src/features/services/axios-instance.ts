// src/lib/axios.ts
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api",
	headers: {
		"Content-Type": "application/json",
	},
	// withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => {
		const message = response.data?.message;
		if ([201, 204].includes(response.status)) {
			if (message) {
				toast.success(message);
			}
		}
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			toast.error("Unauthorized access. Please log in again.");
			// Optional: redirect to login or refresh token
			console.warn("Unauthorized - maybe redirect to login?");
		} else {
			toast.error(error.response?.data?.message || "An error occurred");
		}
		return Promise.reject(error);
	}
);

export default api;
