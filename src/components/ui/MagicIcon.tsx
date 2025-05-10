import React from "react";
import { IconProps } from "../icons";
const MagicIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
	className,
	children,
	size = 6,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={1.5}
			width={20}
			{...props}
			className={`size-${size} ${className} transition-all duration-100 `}
		>
			{children}
		</svg>
	);
};

export default MagicIcon;
