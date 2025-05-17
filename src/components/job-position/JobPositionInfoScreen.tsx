import React from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import JobPositionInformation from "../jobs-for-candidates/JobPositionInformation";
import { useParams } from "react-router-dom";
import { useGetJobPosition } from "../../features/service-hooks/useJobPositionService";
import NoDataScreen from "../ui/NoDataScreen";
import CandidateCard from "../candidate/CandidateCard";

const JobPositionInfoScreen = () => {
	const { translate } = useLsmTranslation();
	const { id } = useParams();

	const { data, isFetching: isFetchingJobPosition } = useGetJobPosition(
		Number(id)
	);

	if (isFetchingJobPosition && Boolean(id)) {
		return (
			<NoDataScreen
				redirectPath="/job-positions"
				linkLabel={translate("common.goToJobPositions")}
				isFetching={isFetchingJobPosition}
			/>
		);
	}
	const jobPosition = data?.data;

	if (!jobPosition) {
		return (
			<NoDataScreen
				redirectPath="/job-positions"
				linkLabel={translate("common.goToJobPositions")}
			/>
		);
	}

	return (
		<ScreenWrapper title={translate("jobPositionInfoScreen.title")}>
			<div className="flex gap-12">
				<div className="flex flex-col w-3/5 gap-4 max-h-[1200px]">
					<JobPositionInformation jobPosition={jobPosition} />
				</div>
				<div className="flex flex-col w-3/5 gap-4">
					{/* <CandidateCard /> */}
				</div>
			</div>
		</ScreenWrapper>
	);
};

export default JobPositionInfoScreen;
