import {
	CalendarDate,
	DateRangePicker,
	DateRangePickerProps,
} from "@heroui/react";
import React from "react";
import { parseDate } from "@internationalized/date";

type Props = {
	defaultVals?: {
		startDate: string;
		endDate: string;
	};
} & DateRangePickerProps;
const MagicDateRangePicker: React.FC<Props> = (props) => {
	const defaultValue = props?.defaultVals
		? {
				start: parseDate(props?.defaultVals?.startDate as string),
				end: parseDate(props?.defaultVals?.endDate as string),
		  }
		: undefined;
	return (
		<DateRangePicker
			data-testid="magic-date-range-picker"
			{...props}
			{...{
				classNames: {
					...props.classNames,
				},
			}}
			aria-label="Select a date range"
			defaultValue={
				defaultValue as unknown as { start: CalendarDate; end: CalendarDate }
			}
		/>
	);
};

export default MagicDateRangePicker;
