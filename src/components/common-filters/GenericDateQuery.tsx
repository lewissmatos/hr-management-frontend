import React, { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import { MagicDatePicker, MagicIconButton } from "../ui";
import { format, parseISO } from "date-fns";
import { parseDate } from "@internationalized/date";
import { CircleX } from "lucide-react";
import { CircularProgress } from "@heroui/react";

type Props = {
	paramName: string;
	date: string;
	setDebouncedDate: (date: string) => void;
	className?: string;
	isLoading?: boolean;
};
const GenericDateQuery: FC<Props> = ({
	paramName,
	date,
	setDebouncedDate,
	isLoading,
	className,
}) => {
	const { translate } = useLsmTranslation();
	return (
		<MagicDatePicker
			label={translate(paramName)}
			className={`w-[300px] ${className}`}
			value={date ? parseDate(format(new Date(date), "yyyy-MM-dd")) : null}
			onChange={(date) => {
				setDebouncedDate(
					parseISO(date?.toString() || new Date().toISOString()).toISOString()
				);
			}}
			startContent={
				isLoading ? (
					<CircularProgress
						size="sm"
						aria-label={translate("loading")}
						color="primary"
					/>
				) : (
					<MagicIconButton
						size="sm"
						variant="flat"
						onPress={() => {
							setDebouncedDate("");
						}}
						tooltipProps={{
							content: translate("common.clear"),
							color: "danger",
						}}
					>
						<CircleX className="text-red-500" size={18} />
					</MagicIconButton>
				)
			}
		/>
	);
};

export default GenericDateQuery;
