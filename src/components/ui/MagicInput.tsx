import { extendVariants, Input } from "@heroui/react";

const MagicInput = extendVariants(Input, {
	defaultVariants: { variant: "flat" },
});
export default MagicInput;
