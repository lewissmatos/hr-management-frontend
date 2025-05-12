import React, { FC } from "react";

type Props = {
	children: React.ReactNode;
	title: string;
	headerOptions?: React.ReactNode;
};
const ScreenWrapper: FC<Props> = ({ children, title, headerOptions }) => {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex flex-row justify-between items-center">
				<h3 className="font-semibold text-3xl"> {title}</h3>
				{headerOptions}
			</div>
			<div>{children}</div>
		</div>
	);
};

export default ScreenWrapper;
