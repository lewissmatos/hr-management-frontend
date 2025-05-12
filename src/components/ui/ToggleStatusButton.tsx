import { CircleCheckBig, CircleMinus } from "lucide-react";
import { FC } from "react";
import MagicIconButton from "./MagicIconButton";
import { useLsmTranslation } from "react-lsm";

type Props = {
	onPress: () => void;
	isActive: boolean;
	isLoading?: boolean;
};
const ToggleStatusButton: FC<Props> = ({ isActive, isLoading, onPress }) => {
	const { translate } = useLsmTranslation();
	return (
		<MagicIconButton
			tooltipProps={{
				content: isActive ? translate("disable") : translate("enable"),
				color: isActive ? "danger" : "success",
			}}
			size="sm"
			variant="flat"
			onPress={onPress}
			isDisabled={isLoading}
		>
			{isActive ? (
				<CircleMinus size={18} className="text-red-500" />
			) : (
				<CircleCheckBig size={18} className="text-green-500" />
			)}
		</MagicIconButton>
	);
};

export default ToggleStatusButton;
