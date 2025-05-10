import { CalendarDate, DatePicker, DatePickerProps } from "@heroui/react";
import React from "react";
import { parseDate } from "@internationalized/date";

type Props = {
	defaultVal?: string;
} & DatePickerProps;
const MagicDatePicker: React.FC<Props> = (props) => {
	const defaultValue = props?.defaultVal
		? parseDate(props?.defaultVal as string)
		: undefined;
	return (
		<DatePicker
			data-testid="magic-date-picker"
			{...props}
			{...{
				classNames: {
					...props.classNames,
				},
			}}
			defaultValue={defaultValue as unknown as CalendarDate}
		/>
	);
};

export default MagicDatePicker;
