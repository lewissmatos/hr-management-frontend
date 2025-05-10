import { Autocomplete, type AutocompleteProps } from "@heroui/react";

type Props = {
	children: React.ReactNode;
} & AutocompleteProps;
const MagicAutocomplete = ({ children, ...props }: Props) => {
	return (
		<Autocomplete variant="flat" {...props} data-testid="magic-autocomplete">
			{children}
		</Autocomplete>
	);
};
export default MagicAutocomplete;
