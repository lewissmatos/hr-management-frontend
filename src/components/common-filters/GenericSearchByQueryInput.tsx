import React, { FC, useEffect } from "react";
import { MagicInput } from "../ui";
import useDebounce from "../../hooks/useDebounce";
import { useLsmTranslation } from "react-lsm";
import { CircularProgress, InputProps } from "@heroui/react";
import { formatList } from "../../utils/format.utils";

type Props = {
	setQuery: (query: string) => void;
	isLoading?: boolean;
	properties: string[];
	inputType?: "text" | "number" | "email" | "password";
	className?: string;
	startContent?: React.ReactNode;
	overrideLabel?: string;
} & InputProps;
const GenericSearchByQueryInput: FC<Props> = ({
	setQuery,
	isLoading,
	properties,
	inputType = "text",
	className,
	startContent,
	overrideLabel,
	...rest
}) => {
	const { translate } = useLsmTranslation();
	const [debouncedSearchInput, setSearchInput] = useDebounce();

	useEffect(() => {
		setQuery(debouncedSearchInput);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchInput]);

	const translatedProps = formatList(properties.map((prop) => translate(prop)));
	return (
		<MagicInput
			label={
				overrideLabel ||
				translate(`common.searchBy`, {
					replace: {
						values: {
							field: translatedProps,
						},
					},
				})
			}
			type={inputType}
			className={`w-1/5 ${className}`}
			onChange={(e) => {
				setSearchInput(e.target.value);
			}}
			startContent={startContent}
			endContent={
				isLoading ? (
					<CircularProgress
						size="sm"
						aria-label={translate("loading")}
						color="primary"
					/>
				) : (
					<></>
				)
			}
			{...rest}
		/>
	);
};

export default GenericSearchByQueryInput;
