import React from "react";
import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import NoDataScreen from "../ui/NoDataScreen";
import { Candidate } from "../../types/app-types";
import {
	useGetCandidates,
	useMakeCandidateEmployee,
} from "../../features/service-hooks/useCandidateService";
import { useDisclosure } from "@heroui/react";
import { useToggleJobPositionAvailability } from "../../features/service-hooks/useJobPositionService";
import useDebounce from "../../hooks/useDebounce";
import CandidatesTable from "./CandidatesTable";
import CandidatesFilters from "./CandidatesFilters";
import MakeCandidateEmployeeDialog from "./MakeCandidateEmployeeDialog";

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
		recommendedBy: "",
		department: "",
		isEmployee: [true, false],
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
						setRecommendedByQuery={(value) =>
							setOtherFilters((prev) => ({
								...prev,
								recommendedBy: value,
							}))
						}
						setDepartmentQuery={(value) =>
							setOtherFilters((prev) => ({
								...prev,
								department: value,
							}))
						}
						setIsEmployeeQuery={(value) =>
							setOtherFilters((prev) => ({
								...prev,
								isEmployee: value,
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

export default CandidatesScreen;
