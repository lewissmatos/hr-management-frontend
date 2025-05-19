import { Autocomplete, AutocompleteItem } from "@heroui/react";
import useDebounce from "../../hooks/useDebounce";
import { useLsmTranslation } from "react-lsm";

type Props<T> = {
	key: string;
	setSelectedValue: (x: string) => void;
	displayPropName: string;
	labelKey: string;
	useQueryHook: (filters: any) => {
		data: { data: T[] };
		isLoading: boolean;
	};
};
const LazyAutocompleteQuery = <T,>({
	key,
	setSelectedValue,
	displayPropName,
	labelKey,
	useQueryHook,
	...props
}: Props<T>) => {
	const { translate } = useLsmTranslation();

	const [debouncedSearch, setDebouncedSearch, searchInput] = useDebounce();

	const { data, isLoading: isFetching } = useQueryHook({
		[displayPropName]: debouncedSearch,
		isActive: [true],
	});

	return (
		<Autocomplete
			label={translate(labelKey)}
			key={key}
			onSelectionChange={(selectedKey) => {
				setSelectedValue(selectedKey?.toString() || "");
			}}
			isLoading={isFetching}
			inputValue={searchInput}
			onInputChange={(value) => setDebouncedSearch(value)}
			{...props}
		>
			{
				data?.data.map((x) => (
					<AutocompleteItem key={x[displayPropName]}>
						{x[displayPropName]}
					</AutocompleteItem>
				)) as any
			}
		</Autocomplete>
	);
};

export default LazyAutocompleteQuery;
