import React, { useState } from "react";
import { useLsmTranslation } from "react-lsm";
import { useNavigate, useParams } from "react-router-dom";
import {
	useGetCandidate,
	useMakeCandidateEmployee,
} from "../../features/service-hooks/useCandidateService";
import NoDataScreen from "../ui/NoDataScreen";
import ScreenWrapper from "../ui/ScreenWrapper";
import { Alert, Button, Divider, Tooltip, useDisclosure } from "@heroui/react";
import { BriefcaseBusiness, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/format.utils";
import { Candidate } from "../../types/app-types";
import MakeCandidateEmployeeDialog from "./MakeCandidateEmployeeDialog";
import { useToggleJobPositionAvailability } from "../../features/service-hooks/useJobPositionService";

const CandidateInformationScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const [candidateToMakeEmployee, setCandidateToMakeEmployee] =
		useState<Candidate | null>(null);

	const {
		isOpen: isModalToMakeEmployeeOpen,
		onClose: onCloseModalToMakeEmployee,
		onOpen: onOpenModalToMakeEmployee,
	} = useDisclosure();

	const {
		mutateAsync: onMakeCandidateEmployee,
		isPending: isMakingCandidateEmployee,
	} = useMakeCandidateEmployee();
	const {
		mutateAsync: onToggleJobPositionAvailability,
		isPending: isToggleJobPositionAvailabilityPending,
	} = useToggleJobPositionAvailability();

	const { id } = useParams();

	const { data, isSuccess, isFetching, refetch } = useGetCandidate(Number(id));

	const candidate = isSuccess && data?.data && Boolean(id) ? data?.data : null;

	if (!candidate) {
		return (
			<NoDataScreen
				isFetching={isFetching}
				elementName="candidate"
				redirectPath="/candidates"
				linkLabel={translate("candidates")}
			/>
		);
	}

	const onMakeEmployeeClick = () => {
		setCandidateToMakeEmployee(candidate);
		onOpenModalToMakeEmployee();
	};

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
						await refetch();
						onCloseModalToMakeEmployee();
					}}
				/>
			)}
			<ScreenWrapper title={translate("candidateInformationScreen.title")}>
				<Divider />
				<div className="w-full flex flex-col py-4 justify-start gap-4">
					<div className="flex flex-col justify-start items-start gap-2">
						<div className="flex flex-row gap-2">
							<p className="text-2xl font-semibold">{candidate.name}</p>
							<p
								className={`text-xl text-foreground-500 `}
							>{` / ${candidate?.cedula}`}</p>
						</div>
						{candidate.isEmployee ? (
							<Alert
								color="warning"
								title={`${translate(
									"candidateInformationScreen.isEmployeeMessage"
								)}`}
							/>
						) : (
							<Button
								fullWidth
								variant="solid"
								size="sm"
								className="w-42"
								color="primary"
								onPress={() => onMakeEmployeeClick()}
								endContent={<BriefcaseBusiness size={18} />}
							>
								{translate("candidateScreen.makeEmployee")}
							</Button>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-start">
						<div className="text-sm text-foreground-500 flex gap-2 items-center justify-start">
							<BriefcaseBusiness size={26} className="text-primary-500" />
							<span
								className="text-lg font-semibold text-primary-500 hover:text-primary-600 hover:underline cursor-pointer"
								onClick={() =>
									navigate(`/job-position/${candidate.applyingJobPosition.id}`)
								}
							>
								{candidate.applyingJobPosition.name}
							</span>
						</div>
						<div className="text-sm text-foreground-500 flex gap-2 justify-start">
							<CircleDollarSign size={26} className="text-primary-500" />
							<span className="text-lg font-semibold text-primary-500">
								{formatCurrency(Number(candidate.minExpectedSalary))}
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-1 items-start justify-start ">
						{candidate?.recommendedBy?.name ? (
							<Tooltip
								content={`${translate("recommendedBy")}: ${
									candidate?.recommendedBy?.name
								}`}
								placement="left-start"
							>
								<span className="text-md text-foreground-500">
									{`${translate("recommendedBy")}: ${
										candidate?.recommendedBy?.name
									}`}
								</span>
							</Tooltip>
						) : (
							<></>
						)}
					</div>
					<div className="w-full grid grid-cols-4 gap-3 ">
						<SectionWrapper
							title={translate("proficiencies")}
							elements={candidate.proficiencies}
							propName="description"
						/>
						<SectionWrapper
							title={translate("languages")}
							elements={candidate.spokenLanguages}
							propName="name"
						/>
						<SectionWrapper
							title={translate("trainings")}
							elements={candidate.trainings}
							propCallback={(x) => {
								return `${x.name} (${x.institution}) `;
							}}
						/>
						<SectionWrapper
							title={translate("workExperiences")}
							elements={candidate.workExperiences}
							propCallback={(x) => {
								return `${x.position} (${x.company}) `;
							}}
						/>
					</div>
				</div>
			</ScreenWrapper>
		</>
	);
};

const SectionWrapper = <T,>({
	elements,
	title,
	propName,
	propCallback,
}: {
	elements: T[];
	title: string;
	propName?: string;
	propCallback?: (x: T) => string;
}) => {
	if (elements.length === 0) return <></>;
	return (
		<div className="overflow-x-hidden w-full flex flex-col rounded-md bg-foreground-100 p-2">
			<p className="text-md font-semibold mb-1">{title}</p>
			<ul className=" overflow-x-hidden overflow-y-visible">
				{elements?.map((x) => (
					<li key={title} className="text-sm text-foreground-500">
						{propName ? `${x[propName]}.` : propCallback ? propCallback(x) : ""}
					</li>
				))}
			</ul>
		</div>
	);
};
export default CandidateInformationScreen;
