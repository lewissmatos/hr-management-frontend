import React from "react";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import { CircleDollarSign } from "lucide-react";
import { useLsmTranslation } from "react-lsm";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import useDebounce from "../../hooks/useDebounce";
import { useGetProficiencies } from "../../features/service-hooks/useProficiencyService";
import { useGetTrainings } from "../../features/service-hooks/useTrainingService";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import { useGetLanguages } from "../../features/service-hooks/useLanguageService";

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
}: Props) => {
	const { translate } = useLsmTranslation();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-4">
				<GenericSearchByQueryInput
					properties={["cedula", "name", "department", "recommendedBy"]}
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
			</div>
		</div>
	);
};

type LazyAutocompleteQueryProps<T> = {
	key: string;
	setSelectedValue: (x: string) => void;
	displayPropName: string;
	labelKey: string;
	useQueryHook: (filters: any) => {
		data: { data: T[] };
		isLoading: boolean;
	};
};
const LazyAutocompleteQuery = <T,>({
	key,
	setSelectedValue,
	displayPropName,
	labelKey,
	useQueryHook,
}: LazyAutocompleteQueryProps<T>) => {
	const { translate } = useLsmTranslation();

	const [debouncedSearch, setDebouncedSearch, searchInput] = useDebounce();

	const { data, isLoading: isFetching } = useQueryHook({
		[displayPropName]: debouncedSearch,
		isActive: [true],
	});

	return (
		<Autocomplete
			label={translate(labelKey)}
			className="w-full"
			key={key}
			onSelectionChange={(selectedKey) => {
				setSelectedValue(selectedKey?.toString() || "");
			}}
			isLoading={isFetching}
			inputValue={searchInput}
			onInputChange={(value) => setDebouncedSearch(value)}
		>
			{
				data?.data.map((x) => (
					<AutocompleteItem key={x[displayPropName]}>
						{x[displayPropName]}
					</AutocompleteItem>
				)) as any
			}
		</Autocomplete>
	);
};
export default CandidatesFilters;
