import React from "react";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import { CircleDollarSign } from "lucide-react";
import { useLsmTranslation } from "react-lsm";
import { SelectItem } from "@heroui/react";
import { useGetProficiencies } from "../../features/service-hooks/useProficiencyService";
import { useGetTrainings } from "../../features/service-hooks/useTrainingService";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import { useGetLanguages } from "../../features/service-hooks/useLanguageService";
import { useGetEmployees } from "../../features/service-hooks/useEmployeeService";
import { MagicSelect } from "../ui";
import { Departments } from "../../types/app-types";
import LazyAutocompleteQuery from "../common-filters/LazyAutocompleteQuery";
import GenericBooleanQueryHandler from "../common-filters/GenericBooleanQueryHandler";

type Props = {
	isFetching: boolean;
	setDebouncedSearchInput: (x: string) => void;
	setDebouncedStartApplyingDate;
	setDebouncedEndApplyingDate;
	startApplyingDate: string;
	endApplyingDate;
	setDebouncedStartSalaryInput: (x: string) => void;
	setDebouncedEndSalaryInput: (x: string) => void;
	setProficiencyQuery: (x: string) => void;
	setTrainingQuery: (x: string) => void;
	setLanguageQuery: (x: string) => void;
	setApplyingJobPositionQuery: (x: string) => void;
	setRecommendedByQuery: (x: string) => void;
	setDepartmentQuery: (x: string) => void;
	setIsEmployeeQuery: (x: boolean[]) => void;
};
const CandidatesFilters = ({
	isFetching,
	setDebouncedSearchInput,
	setDebouncedEndSalaryInput,
	setDebouncedStartApplyingDate,
	setDebouncedEndApplyingDate,
	startApplyingDate,
	endApplyingDate,
	setDebouncedStartSalaryInput,
	setProficiencyQuery,
	setTrainingQuery,
	setLanguageQuery,
	setApplyingJobPositionQuery,
	setRecommendedByQuery,
	setDepartmentQuery,
	setIsEmployeeQuery,
}: Props) => {
	const { translate } = useLsmTranslation();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-4">
				<GenericSearchByQueryInput
					properties={["cedula", "name"]}
					isLoading={isFetching}
					setQuery={(query) => {
						setDebouncedSearchInput(query);
					}}
				/>
				<GenericDateQuery
					paramName="startApplyingDate"
					date={startApplyingDate}
					setDebouncedDate={setDebouncedStartApplyingDate}
					isLoading={isFetching}
				/>
				<GenericDateQuery
					paramName="endApplyingDate"
					date={endApplyingDate}
					setDebouncedDate={setDebouncedEndApplyingDate}
					isLoading={isFetching}
				/>
				<GenericBooleanQueryHandler
					label={translate("isEmployee")}
					setQuery={(values) => {
						setIsEmployeeQuery(values);
					}}
					overrideOptions={[
						{ label: "employee", value: "1" },
						{ label: "notEmployee", value: "0" },
					]}
				/>
				<GenericSearchByQueryInput
					properties={["salary"]}
					isLoading={isFetching}
					inputType="number"
					className="w-1/6"
					startContent={
						<CircleDollarSign className="text-primary-500" size={18} />
					}
					setQuery={(query) => {
						setDebouncedStartSalaryInput(query);
					}}
					overrideLabel={translate("startSalary")}
				/>
				<GenericSearchByQueryInput
					properties={["salary"]}
					isLoading={isFetching}
					inputType="number"
					className="w-1/6"
					startContent={
						<CircleDollarSign className="text-primary-500" size={18} />
					}
					setQuery={(query) => {
						setDebouncedEndSalaryInput(query);
					}}
					overrideLabel={translate("endSalary")}
				/>
			</div>
			<div className="flex flex-row gap-4">
				<LazyAutocompleteQuery
					key="proficiency-description"
					setSelectedValue={setProficiencyQuery}
					displayPropName="description"
					labelKey="proficiency"
					useQueryHook={useGetProficiencies as any}
				/>
				<LazyAutocompleteQuery
					key="training-name"
					setSelectedValue={setTrainingQuery}
					displayPropName="name"
					labelKey="training"
					useQueryHook={useGetTrainings as any}
				/>
				<LazyAutocompleteQuery
					key="language-name"
					setSelectedValue={setLanguageQuery}
					displayPropName="name"
					labelKey="language"
					useQueryHook={useGetLanguages as any}
				/>
				<LazyAutocompleteQuery
					key="job-position-name"
					setSelectedValue={setApplyingJobPositionQuery}
					displayPropName="name"
					labelKey="candidateScreen.applyingJobPosition"
					useQueryHook={useGetJobPositions as any}
				/>
				<MagicSelect
					label={translate("department")}
					onSelectionChange={(selectedKeys) => {
						if (!selectedKeys) return;
						setDepartmentQuery([...selectedKeys] as any);
					}}
				>
					{Object.values(Departments).map((department) => (
						<SelectItem key={department}>{department}</SelectItem>
					))}
				</MagicSelect>
				<LazyAutocompleteQuery
					key="recommended-by-name"
					setSelectedValue={setRecommendedByQuery}
					displayPropName="name"
					labelKey="recommendedBy"
					useQueryHook={useGetEmployees as any}
				/>
			</div>
		</div>
	);
};

export default CandidatesFilters;
