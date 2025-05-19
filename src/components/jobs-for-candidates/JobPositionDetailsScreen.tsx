import React, { useState } from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useParams } from "react-router-dom";
import { useGetJobPosition } from "../../features/service-hooks/useJobPositionService";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import CandidateProfileDetails from "./CandidateProfileDetails";
import {
	Button,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import {
	useAddCandidate,
	useUpdateCandidate,
} from "../../features/service-hooks/useCandidateService";
import { Candidate } from "../../types/app-types";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";
import JobPositionInformation from "./JobPositionInformation";

const JobPositionDetailsScreen = () => {
	const { translate } = useLsmTranslation();
	const { id } = useParams();

	const { data, isFetching: isFetchingJobPosition } = useGetJobPosition(
		Number(id)
	);
	const { saveInfo, hasCandidate, candidateData } = useApplyingCandidateStore();

	const {
		isOpen: isConfirmApplyDialogOpen,
		onClose: onCloseConfirmApplyDialogOpen,
		onOpen: onOpenConfirmApplyDialogOpen,
	} = useDisclosure();

	const { mutateAsync: onUpdateCandidate, isPending: isUpdatingCandidate } =
		useUpdateCandidate();

	const { mutateAsync: onAddCandidate, isPending: isAddingCandidate } =
		useAddCandidate();
	const jobPosition = data?.data;
	const [candidateInfo, setCandidateInfo] = useState<Candidate>({
		applyingJobPosition: jobPosition,
	} as Candidate);

	const onApplyJobPosition = async (info: Partial<Candidate>) => {
		if (jobPosition) {
			try {
				let candidateInfo = info;
				if (hasCandidate) {
					const res = await onUpdateCandidate({
						...info,
						applyingJobPosition: jobPosition,
					});
					candidateInfo = {
						...info,
						...res.data?.data,
						applyingJobPosition: jobPosition,
					};
				} else {
					const res = await onAddCandidate({
						...info,
						applyingJobPosition: jobPosition,
					});
					candidateInfo = {
						...info,
						...res.data?.data,
						applyingJobPosition: jobPosition,
					};
				}
				saveInfo({
					...candidateInfo,
					applyingJobPosition: jobPosition,
				} as Candidate);
			} catch (error) {
				console.error("Error applying for job position:", error);
			}
		}
	};

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
				isFetching={false}
			/>
		);
	}

	return (
		<ScreenWrapper
			title={translate("jobPositionDetailsScreen.title")}
			className="p-4"
		>
			<ConfirmApplyJobPositionDialog
				isOpen={isConfirmApplyDialogOpen}
				onClose={onCloseConfirmApplyDialogOpen}
				onConfirm={async () => {
					onCloseConfirmApplyDialogOpen();
					await onApplyJobPosition(candidateInfo);
				}}
				currentPositionName={candidateData?.applyingJobPosition?.name || ""}
				newPositionName={jobPosition.name}
			/>
			<div className="flex gap-8">
				<div className="flex flex-col w-2/5 gap-4 max-h-[1200px]">
					<h2 className="text-2xl font-semibold">
						{translate("jobPositionDetailsScreen.jobPosition")}
					</h2>
					<Divider />
					<JobPositionInformation jobPosition={jobPosition} />
				</div>
				<Divider orientation="vertical" />
				<div className="flex flex-col w-3/5 gap-4">
					<h2 className="text-2xl font-semibold">
						{translate("jobPositionDetailsScreen.candidateInfo")}
					</h2>
					<Divider />
					<CandidateProfileDetails
						isApplying={isUpdatingCandidate || isAddingCandidate}
						onApplyJobPosition={async (candidate) => {
							setCandidateInfo((prevVal) => ({
								...prevVal,
								...candidate,
							}));
							if (candidateData?.applyingJobPosition) {
								onOpenConfirmApplyDialogOpen();
							} else {
								await onApplyJobPosition(candidate);
							}
						}}
						applyingJobPosition={jobPosition}
					/>
				</div>
			</div>
		</ScreenWrapper>
	);
};

type ConfirmApplyJobPositionDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	currentPositionName: string;
	newPositionName: string;
};
const ConfirmApplyJobPositionDialog = ({
	isOpen,
	onClose,
	onConfirm,
	currentPositionName,
	newPositionName,
}: ConfirmApplyJobPositionDialogProps) => {
	const { translate } = useLsmTranslation();
	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate(
								"jobPositionDetailsScreen.confirmApplyJobPosition.title"
							)}
						</ModalHeader>
						<ModalBody>
							<p className="text-lg">
								{translate(
									"jobPositionDetailsScreen.confirmApplyJobPosition.message",
									{
										replace: {
											values: {
												currentPosition: currentPositionName,
												newPosition: newPositionName,
											},
										},
									}
								)}
							</p>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								{translate("common.cancel")}
							</Button>
							<Button color="primary" onPress={async () => await onConfirm()}>
								{translate("common.confirm")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default JobPositionDetailsScreen;
