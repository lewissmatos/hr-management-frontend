import React from "react";
import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { MagicInput } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Candidate } from "../../types/app-types";
import { CircleDollarSign } from "lucide-react";
import {
	useGetCandidates,
	useMakeCandidateEmployee,
} from "../../features/service-hooks/useCandidateService";
import { formatCurrency } from "../../utils/format.utils";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useToggleJobPositionAvailability } from "../../features/service-hooks/useJobPositionService";
import useDebounce from "../../hooks/useDebounce";
import CandidatesTable from "./CandidatesTable";
import CandidatesFilters from "./CandidatesFilters";

const CandidatesScreen = () => {
	const { translate } = useLsmTranslation();
	const [debouncedSearchInput, setDebouncedSearchInput] = useDebounce();
	const [
		debouncedStartApplyingDate,
		setDebouncedStartApplyingDate,
		startApplyingDate,
	] = useDebounce();
	const [
		debouncedEndApplyingDate,
		setDebouncedEndApplyingDate,
		endApplyingDate,
	] = useDebounce();

	const [debouncedStartSalaryInput, setDebouncedStartSalaryInput] =
		useDebounce();
	const [debouncedEndSalaryInput, setDebouncedEndSalaryInput] = useDebounce();

	const [otherFilters, setOtherFilters] = React.useState({
		proficiency: "",
		training: "",
		language: "",
		applyingJobPosition: "",
	});

	const {
		data,
		refetch: refetchCandidates,
		isFetching,
	} = useGetCandidates({
		searchParam: debouncedSearchInput,
		startApplyingDate: debouncedStartApplyingDate,
		endApplyingDate: debouncedEndApplyingDate,
		startSalary: debouncedStartSalaryInput,
		endSalary: debouncedEndSalaryInput,
		...otherFilters,
	});

	const {
		mutateAsync: onMakeCandidateEmployee,
		isPending: isMakingCandidateEmployee,
	} = useMakeCandidateEmployee();
	const list = data?.data;

	const {
		mutateAsync: onToggleJobPositionAvailability,
		isPending: isToggleJobPositionAvailabilityPending,
	} = useToggleJobPositionAvailability();

	const [candidateToMakeEmployee, setCandidateToMakeEmployee] =
		React.useState<Candidate | null>(null);

	const {
		isOpen: isModalToMakeEmployeeOpen,
		onClose: onCloseModalToMakeEmployee,
		onOpen: onOpenModalToMakeEmployee,
	} = useDisclosure();

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

			<ScreenWrapper title={translate("candidates")}>
				<div className="flex flex-col gap-4">
					<CandidatesFilters
						isFetching={isFetching}
						setDebouncedSearchInput={setDebouncedSearchInput}
						setDebouncedEndSalaryInput={setDebouncedEndSalaryInput}
						setDebouncedStartApplyingDate={setDebouncedStartApplyingDate}
						startApplyingDate={startApplyingDate}
						setDebouncedEndApplyingDate={setDebouncedEndApplyingDate}
						endApplyingDate={endApplyingDate}
						setDebouncedStartSalaryInput={setDebouncedStartSalaryInput}
						setProficiencyQuery={(value) =>
							setOtherFilters((prev) => ({ ...prev, proficiency: value }))
						}
						setTrainingQuery={(value) =>
							setOtherFilters((prev) => ({ ...prev, training: value }))
						}
						setLanguageQuery={(value) =>
							setOtherFilters((prev) => ({ ...prev, language: value }))
						}
						setApplyingJobPositionQuery={(value) =>
							setOtherFilters((prev) => ({
								...prev,
								applyingJobPosition: value,
							}))
						}
					/>
					{list?.length ? (
						<CandidatesTable
							data={list}
							onOpenModalToMakeEmployee={onOpenModalToMakeEmployee}
							setCandidateToMakeEmployee={setCandidateToMakeEmployee}
						/>
					) : (
						<NoDataScreen isFetching={isFetching} elementName="candidate" />
					)}
				</div>
			</ScreenWrapper>
		</>
	);
};
type MakeCandidateEmployeeDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	candidate: Candidate;
	onConfirm: (salary?: number) => Promise<void>;
	isLoading: boolean;
};
const MakeCandidateEmployeeDialog = ({
	isOpen,
	onClose,
	candidate,
	onConfirm,
	isLoading,
}: MakeCandidateEmployeeDialogProps) => {
	const { translate } = useLsmTranslation();
	const [salary, setSalary] = React.useState<number>(
		candidate?.minExpectedSalary || 0
	);
	const minSalary = candidate?.minExpectedSalary
		? Number(
				candidate.minExpectedSalary - Number(candidate.minExpectedSalary) * 0.05
		  )
		: 0;
	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate("candidateScreen.makeEmployeeModal.title", {
								replace: { values: { candidateName: candidate.name } },
							})}
						</ModalHeader>
						<ModalBody>
							<p className="text-lg">
								{translate("candidateScreen.makeEmployeeModal.message")}
							</p>
							<MagicInput
								label={translate("salary")}
								value={String(salary)}
								onChange={(e) => {
									const value = e.target.value;
									setSalary(Number(value));
								}}
								min={minSalary}
								type="number"
								className="mt-2"
								startContent={
									<CircleDollarSign className="text-primary-500" size={18} />
								}
							/>
							{minSalary ? (
								<small
									className={
										salary < minSalary ? "text-red-500" : "text-green-500"
									}
								>
									{translate(
										"candidateScreen.makeEmployeeModal.salaryWarning",
										{
											replace: {
												values: {
													minSalary: formatCurrency(minSalary),
												},
											},
										}
									)}
								</small>
							) : (
								<></>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								isDisabled={isLoading}
							>
								{translate("common.cancel")}
							</Button>
							<Button
								color="primary"
								onPress={async () => await onConfirm(salary)}
								isDisabled={isLoading || salary < minSalary}
								isLoading={isLoading}
							>
								{translate("common.confirm")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CandidatesScreen;
