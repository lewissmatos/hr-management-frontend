import React, { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import { MagicDatePicker, MagicIconButton } from "../ui";
import { format, parseISO } from "date-fns";
import { parseDate } from "@internationalized/date";
import { CircleX } from "lucide-react";
import { CircularProgress, Tooltip } from "@heroui/react";

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
					<Tooltip content={translate("common.clear")} color="danger">
						<CircleX
							onClick={() => {
								setDebouncedDate("");
							}}
							className="text-red-500 cursor-pointer"
							size={18}
						/>
					</Tooltip>
				)
			}
		/>
	);
};

export default GenericDateQuery;
