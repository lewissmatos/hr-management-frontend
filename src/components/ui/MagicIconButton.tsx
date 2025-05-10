// MagicIconButton.tsx
import { FC } from "react";
import { Button, Tooltip } from "@heroui/react";
import type { ButtonProps, TooltipProps } from "@heroui/react";

type Props = {
	tooltipProps?: TooltipProps;
};
const MagicIconButton: FC<ButtonProps & Props> = ({ children, ...props }) =>
	props.tooltipProps ? (
		<Tooltip
			{...props.tooltipProps}
			hidden={props?.tooltipProps?.hidden || !props.tooltipProps}
		>
			<Button data-testid="magic-icon-button" {...props} isIconOnly>
				{children}
			</Button>
		</Tooltip>
	) : (
		<Button data-testid="magic-icon-button" {...props} isIconOnly>
			{children}
		</Button>
	);

export default MagicIconButton;
