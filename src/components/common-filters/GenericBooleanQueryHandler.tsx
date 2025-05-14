import React, { FC } from "react";
import { MagicSelect } from "../ui";
import { useLsmTranslation } from "react-lsm";
import { SelectItem } from "@heroui/react";

type Props = {
	queryPropName?: string;
	setFilters: (filters: Record<string, any>) => void;
};
const GenericBooleanQueryHandler: FC<Props> = ({
	queryPropName,
	setFilters,
}) => {
	const { translate } = useLsmTranslation();
	const options = [
		{ label: "active", value: "1" },
		{ label: "inactive", value: "0" },
	];

	const handleChange = (value: string | null) => {
		console.log(value);
		// eslint-disable-next-line no-unsafe-optional-chaining
		const values = (value ? value?.split(",") : []).map((val) =>
			Boolean(Number(val))
		);
		setFilters((prevFilters) => ({
			...prevFilters,
			[queryPropName as string]: values,
		}));
		console.log(values);
	};
	return (
		<MagicSelect
			label={translate("status")}
			className="w-4/12"
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
