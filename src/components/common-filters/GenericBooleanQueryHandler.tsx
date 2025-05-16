import React, { FC } from "react";
import { MagicSelect } from "../ui";
import { useLsmTranslation } from "react-lsm";
import { SelectItem } from "@heroui/react";

type Props = {
	label?: string;
	setQuery: (filters: boolean[]) => void;
	overrideOptions?: Array<{
		label: string;
		value: string;
	}>;
};
const GenericBooleanQueryHandler: FC<Props> = ({
	setQuery,
	label,
	overrideOptions,
}) => {
	const { translate } = useLsmTranslation();
	const options = overrideOptions || [
		{ label: "active", value: "1" },
		{ label: "inactive", value: "0" },
	];

	const handleChange = (value: string | null) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		const values = (value ? value?.split(",") : []).map((val) =>
			Boolean(Number(val))
		);
		setQuery(values);
	};
	return (
		<MagicSelect
			label={label}
			className="w-1/5"
			selectionMode="multiple"
			onChange={(e) => {
				const { value } = e.target;
				handleChange(value);
			}}
			disallowEmptySelection
			defaultSelectedKeys={["1", "0"]}
		>
			{options.map(({ label, value }) => (
				<SelectItem key={value}>{translate(label)}</SelectItem>
			))}
		</MagicSelect>
	);
};

export default GenericBooleanQueryHandler;
