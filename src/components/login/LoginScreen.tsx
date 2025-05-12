import { Button, Form } from "@heroui/react";
import { MagicIconButton, MagicInput } from "../ui";
import { useLsmTranslation } from "react-lsm";
import "./login.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginPayload } from "../../features/services/auth.service";
import { useLoginService } from "../../features/service-hooks/useAuthService";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
const LoginScreen = () => {
	const { translate } = useLsmTranslation();
	const { mutateAsync, isPending } = useLoginService();
	const { register, handleSubmit } = useForm<LoginPayload>();
	const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
		await mutateAsync(data);
	};
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};
	return (
		<div className="login-container flex flex-col justify-center w-screen h-screen">
			<div className="mx-auto max-w-[30%] flex flex-col gap-4 h-screen justify-between items-center py-10">
				<div className="flex flex-col items-center justify-center gap-2">
					<h4 className="font-semibold text-md text-foreground-200">
						{"ISO - 715"}
					</h4>
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
						type={isPasswordVisible ? "text" : "password"}
						{...register("password", {
							required: true,
							minLength: 8,
						})}
						endContent={
							<MagicIconButton
								size="sm"
								variant="light"
								className="group hover:text-yellow-500 transition-all duration-200"
								tooltipProps={{
									content: translate(
										isPasswordVisible
											? "loginScreen.hidePassword"
											: "loginScreen.showPassword"
									),
								}}
								onPress={togglePasswordVisibility}
							>
								{!isPasswordVisible ? (
									<Eye className="text-gray-400" />
								) : (
									<EyeClosed className="text-gray-400" />
								)}
							</MagicIconButton>
						}
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
