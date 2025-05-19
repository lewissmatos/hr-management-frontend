import React, { useState } from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import JobPositionInformation from "../jobs-for-candidates/JobPositionInformation";
import { useParams } from "react-router-dom";
import {
	useGetJobPosition,
	useToggleJobPositionAvailability,
} from "../../features/service-hooks/useJobPositionService";
import NoDataScreen from "../ui/NoDataScreen";
import CandidateCard from "../candidate/CandidateCard";
import {
	useGetCandidatesByPosition,
	useMakeCandidateEmployee,
} from "../../features/service-hooks/useCandidateService";
import { Info } from "lucide-react";
import { useDisclosure } from "@heroui/react";
import MakeCandidateEmployeeDialog from "../candidate/MakeCandidateEmployeeDialog";
import { Candidate } from "../../types/app-types";

const JobPositionInfoScreen = () => {
	const { translate } = useLsmTranslation();
	const { id } = useParams();

	const { data: jobPositionData, isFetching: isFetchingJobPosition } =
		useGetJobPosition(Number(id));
	const jobPosition = jobPositionData?.data;

	const {
		data: candidatesData,
		refetch: refetchCandidates,
		isFetching: isFetchingCandidates,
	} = useGetCandidatesByPosition({
		jobPositionId: Number(id),
	});

	const {
		mutateAsync: onMakeCandidateEmployee,
		isPending: isMakingCandidateEmployee,
	} = useMakeCandidateEmployee();

	const {
		mutateAsync: onToggleJobPositionAvailability,
		isPending: isToggleJobPositionAvailabilityPending,
	} = useToggleJobPositionAvailability();

	const [candidateToMakeEmployee, setCandidateToMakeEmployee] =
		useState<Candidate | null>(null);

	const {
		isOpen: isModalToMakeEmployeeOpen,
		onClose: onCloseModalToMakeEmployee,
		onOpen: onOpenModalToMakeEmployee,
	} = useDisclosure();

	if (isFetchingJobPosition && Boolean(id)) {
		return (
			<NoDataScreen
				redirectPath="/job-positions"
				linkLabel={translate("common.goToJobPositions")}
				isFetching={isFetchingJobPosition}
			/>
		);
	}

	if (!jobPosition) {
		return (
			<NoDataScreen
				redirectPath="/job-positions"
				linkLabel={translate("common.goToJobPositions")}
			/>
		);
	}

	const candidates = candidatesData?.data;

	return (
		<>
			{candidateToMakeEmployee && isModalToMakeEmployeeOpen && (
				<MakeCandidateEmployeeDialog
					isOpen={isModalToMakeEmployeeOpen}
					onClose={onCloseModalToMakeEmployee}
					candidate={candidateToMakeEmployee}
					isLoading={
						isMakingCandidateEmployee || isToggleJobPositionAvailabilityPending
					}
					onConfirm={async (salary?: number) => {
						await Promise.all([
							onMakeCandidateEmployee({
								id: candidateToMakeEmployee.id,
								salary,
							}),
							onToggleJobPositionAvailability(
								candidateToMakeEmployee?.applyingJobPosition.id
							),
						]);
						await refetchCandidates();
						onCloseModalToMakeEmployee();
					}}
				/>
			)}

			<ScreenWrapper title={translate("jobPositionInfoScreen.title")}>
				<div className="flex gap-8">
					<div className="flex flex-col w-3/5 gap-4 max-h-[1200px]">
						<JobPositionInformation jobPosition={jobPosition} />
					</div>
					<div className="flex flex-col w-3/5 gap-4">
						{isFetchingCandidates ? (
							<NoDataScreen isFetching={isFetchingCandidates} />
						) : (
							<></>
						)}
						{candidates?.length && !isFetchingCandidates ? (
							candidates.map((candidate) => (
								<CandidateCard
									onMakeEmployeeClick={() => {
										setCandidateToMakeEmployee(candidate);
										onOpenModalToMakeEmployee();
									}}
									key={candidate.id}
									candidate={candidate}
								/>
							))
						) : (
							<div className="flex flex-fow gap-4 text-cyan-500 font-semibold text-xl">
								<Info />
								{translate("jobPositionInfoScreen.noCandidates")}
							</div>
						)}
					</div>
				</div>
			</ScreenWrapper>
		</>
	);
};

export default JobPositionInfoScreen;
