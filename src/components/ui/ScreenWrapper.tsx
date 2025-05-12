import React, { FC } from "react";

type Props = {
	children: React.ReactNode;
	title: string;
};
const ScreenWrapper: FC<Props> = ({ children, title }) => {
	return (
		<div className="flex flex-col gap-4 p-4">
			<h3 className="font-semibold text-3xl"> {title}</h3>
			<div>{children}</div>
		</div>
	);
};

export default ScreenWrapper;
