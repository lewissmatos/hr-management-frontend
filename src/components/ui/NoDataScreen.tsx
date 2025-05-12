import { Button, CircularProgress } from "@heroui/react";
import { Link2 } from "lucide-react";
import React from "react";
import { useLsmTranslation } from "react-lsm";
import { useNavigate } from "react-router-dom";

const NoDataScreen = ({
	redirectPath,
	linkLabel,
	isFetching = false,
	elementName,
}: {
	redirectPath?: string;
	linkLabel?: string;
	isFetching?: boolean;
	elementName?: string;
}) => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	return (
		<div className="w-full h-screen flex flex-col justify-center items-center gap-4">
			{isFetching ? (
				<div className="flex flex-col gap-2 items-center justify-center">
					<CircularProgress
						size="lg"
						color="primary"
						aria-label={translate("loading")}
					/>
					<p className="text-md font-semibold">{translate("common.loading")}</p>
				</div>
			) : (
				<>
					<p className="text-2xl font-bold">{translate("magicTable.noData")}</p>
					{redirectPath && (
						<Button
							color="primary"
							href={redirectPath}
							variant="solid"
							endContent={<Link2 />}
							onPress={() => {
								navigate(redirectPath);
							}}
						>
							{linkLabel ||
								translate("noDataScreen.goToAddElementScreen", {
									replace: {
										values: { element: translate(elementName || "element") },
									},
								})}
						</Button>
					)}
				</>
			)}
		</div>
	);
};

export default NoDataScreen;
