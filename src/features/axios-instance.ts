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
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			toast.error("Unauthorized access. Please log in again.");
			// Optional: redirect to login or refresh token
			console.warn("Unauthorized - maybe redirect to login?");
		}
		return Promise.reject(error);
	}
);

export default api;
