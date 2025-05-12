import { useMutation } from "@tanstack/react-query";
import { onLogin } from "../services/auth.service";
import getQueryClient from "./tanstackQueryClient";
import useAuthStore from "../store/auth-store";

export const useLoginService = () => {
	const qc = getQueryClient();
	const { login } = useAuthStore();
	return useMutation({
		mutationFn: onLogin,
		onSuccess: (data) => {
			const { user, token } = data.data.data;
			login(user, token);
			qc.invalidateQueries({ queryKey: ["login"] });
		},
	});
};
