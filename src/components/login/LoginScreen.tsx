import { Button, Form } from "@heroui/react";
import { MagicInput } from "../ui";
import { useLsmTranslation } from "react-lsm";
import "./login.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginPayload } from "../../features/services/auth.service";
import { useLoginService } from "../../features/service-hooks/useAuthService";
const LoginScreen = () => {
	const { translate } = useLsmTranslation();
	const { mutateAsync, isPending } = useLoginService();
	const { register, handleSubmit } = useForm<LoginPayload>();
	const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
		await mutateAsync(data);
	};
	return (
		<div className="login-container flex flex-col justify-center w-screen h-screen">
			<div className="mx-auto max-w-[30%] flex flex-col gap-4 h-screen justify-between items-center py-10">
				<div className="flex flex-col items-center justify-center gap-2">
					<h4 className="font-semibold text-md">{"ISO - 715"}</h4>
				</div>
				<Form
					className="w-full flex flex-col gap-4"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h1 className="font-bold text-2xl mb-4">{translate("APP_NAME")}</h1>
					<small className="text-sm text-gray-400">
						{translate("loginScreen.subtitle")}
					</small>
					<MagicInput
						label={translate("loginScreen.username")}
						className="w-full"
						type="text"
						{...register("username", {
							required: true,
							minLength: 3,
						})}
					/>
					<MagicInput
						label={translate("loginScreen.password")}
						className="w-full"
						type="password"
						{...register("password", {
							required: true,
							minLength: 8,
						})}
					/>
					<Button
						variant="solid"
						size="md"
						type="submit"
						className="w-full"
						color="primary"
						isLoading={isPending}
					>
						{translate("loginScreen.loginButton")}
					</Button>
				</Form>
				<div className="flex flex-col gap-2 items-center justify-center">
					<small className="text-sm text-gray-400">
						{translate("loginScreen.footer", {
							replace: { values: { year: new Date().getFullYear() } },
						})}
					</small>
					<small className="text-sm text-gray-400">
						{translate("DEVELOPED_BY")}
					</small>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
