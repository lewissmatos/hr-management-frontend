import React, { FC } from "react";
import MagicInput from "./MagicInput";
import MagicIconButton from "./MagicIconButton";
import { useLsmTranslation } from "react-lsm";
import { Eye, EyeClosed } from "lucide-react";
type Props = {
	label?: string;
	props: React.ComponentProps<typeof MagicInput>;
};

const PasswordInput: FC<Props> = ({ label, ...props }) => {
	const { translate } = useLsmTranslation();
	const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
	const togglePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev);
	};
	return (
		<MagicInput
			label={label || translate("loginScreen.password")}
			className="w-full"
			size="sm"
			type={isPasswordVisible ? "text" : "password"}
			endContent={
				<MagicIconButton
					size="sm"
					variant="light"
					className="group hover:text-primary-500 transition-all duration-200"
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
			{...props}
		/>
	);
};

export default PasswordInput;
