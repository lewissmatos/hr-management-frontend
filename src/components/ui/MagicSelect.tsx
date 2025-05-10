import { Select, SelectProps } from "@heroui/react";

const MagicSelect = ({ children, ...props }: SelectProps) => {
	return (
		<Select variant="flat" {...props} aria-label="Select an option">
			{children}
		</Select>
	);
};
export default MagicSelect;
