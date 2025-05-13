import React from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import JobPositionCard from "./JobPositionCard";

const JobPositionsScreen = () => {
	const { translate } = useLsmTranslation();
	const { data, isFetching, refetch } = useGetJobPositions();
	const list = data?.data;
	return (
		<ScreenWrapper title={translate("jobPositions")}>
			{list?.length ? (
				<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
					{list.map((position) => (
						<JobPositionCard
							key={position.id}
							position={position}
							refetch={refetch as any}
						/>
					))}
				</div>
			) : (
				<NoDataScreen
					isFetching={isFetching}
					elementName="jobPosition"
					linkLabel="/job-position"
				/>
			)}
		</ScreenWrapper>
	);
};

export default JobPositionsScreen;
