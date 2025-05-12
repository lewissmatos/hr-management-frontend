import { Button, CircularProgress, Link } from "@heroui/react";
import React from "react";
import { useLsmTranslation } from "react-lsm";

const NoDataScreen = ({
	redirectPath,
	linkLabel,
	isFetching = false,
}: {
	redirectPath?: string;
	linkLabel?: string;
	isFetching?: boolean;
}) => {
	const { translate } = useLsmTranslation();
	return (
		<div className="w-full h-screen flex justify-center items-center">
			{isFetching ? (
				<CircularProgress
					size="lg"
					color="primary"
					aria-label={translate("loading")}
				/>
			) : (
				<>
					<p className="text-2xl font-bold">{translate("noData")}</p>
					{redirectPath && (
						<Button
							showAnchorIcon
							as={Link}
							color="primary"
							href={redirectPath}
							variant="solid"
						>
							{linkLabel || translate("goToCreate")}
						</Button>
					)}
				</>
			)}
		</div>
	);
};

export default NoDataScreen;
