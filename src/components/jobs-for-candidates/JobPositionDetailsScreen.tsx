import React, { useState } from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useParams } from "react-router-dom";
import { useGetJobPosition } from "../../features/service-hooks/useJobPositionService";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import { formatCurrency } from "../../utils/format.utils";
import { getJobPositionRiskLevelColorClass } from "../job-position/job-position.utils";
import CandidateProfileDetails from "./CandidateProfileDetails";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from "@heroui/react";
import {
	useAddCandidate,
	useUpdateCandidate,
} from "../../features/service-hooks/useCandidateService";
import { Candidate } from "../../types/app-types";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";

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
				if (hasCandidate) {
					await onUpdateCandidate({
						...info,
						applyingJobPosition: jobPosition,
					});
				} else {
					await onAddCandidate({
						...info,
						applyingJobPosition: jobPosition,
					});
				}
				saveInfo({
					...info,
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
	const riskLevelColorClass = getJobPositionRiskLevelColorClass(
		jobPosition.riskLevel
	);

	return (
		<ScreenWrapper title={translate("jobPositionDetailsScreen.title")}>
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
			<div className="flex gap-4">
				<div className="flex flex-col w-1/3 gap-4 max-h-[1200px]">
					<h2 className="text-2xl font-semibold">
						{translate("jobPositionDetailsScreen.jobPosition")}
					</h2>
					<div className="flex flex-col gap-4">
						<ListItem labelKey="name" value={jobPosition.name} />
						<ListItem
							labelKey="riskLevel"
							value={jobPosition.riskLevel}
							valueClassName={`text-${riskLevelColorClass}-500`}
						/>

						<ListItem
							labelKey="minSalary"
							value={formatCurrency(jobPosition.minSalary)}
						/>
						<ListItem
							labelKey="maxSalary"
							value={formatCurrency(jobPosition.maxSalary)}
						/>
						{jobPosition.description && (
							<>
								<small className="font-semibold text-xl">
									{translate("description")}
								</small>
								<Textarea
									value={jobPosition.description}
									isReadOnly
									className=""
									classNames={{
										input:
											"overflow-x-hidden overflow-y-auto min-h-[500px] text-lg hover:bg-transparent focus:bg-transparent focus:outline-none",
									}}
								/>
							</>
						)}
					</div>
				</div>
				<div className="flex flex-col w-2/3 gap-4">
					<h2 className="text-2xl font-semibold">
						{translate("jobPositionDetailsScreen.candidateInfo")}
					</h2>
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

const ListItem = ({
	labelKey,
	value,
	valueClassName,
}: {
	labelKey: string;
	value: string | number | undefined;
	valueClassName?: string;
}) => {
	const { translate } = useLsmTranslation();
	return (
		<div className="flex flex-row gap-2 text-xl">
			<span className="font-semibold">{translate(labelKey)}:</span>
			<span className={`${valueClassName}`}>{value}</span>
		</div>
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
