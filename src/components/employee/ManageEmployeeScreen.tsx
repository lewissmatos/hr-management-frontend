import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Checkbox,
	Form,
	SelectItem,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { Departments, Employee } from "../../types/app-types";
import { useNavigate, useParams } from "react-router-dom";
import { MagicDatePicker, MagicInput, MagicSelect } from "../ui";
import {
	useAddEmployee,
	useGetEmployee,
	useUpdateEmployee,
} from "../../features/service-hooks/useEmployeeService";
import { Save } from "lucide-react";
import NoDataScreen from "../ui/NoDataScreen";
import { format, parseISO } from "date-fns";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import { useEffect, useState } from "react";
import { useGetCandidates } from "../../features/service-hooks/useCandidateService";
import useDebounce from "../../hooks/useDebounce";

const ManageEmployeeScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const id = useParams<{ id?: string }>()?.id;
	const {
		data: employeeData,
		isSuccess,
		isPending: isFetchingEmployee,
	} = useGetEmployee(Number(id));
	const { mutateAsync: onAdd, isPending: isAddPending } = useAddEmployee();
	const { mutateAsync: onUpdate, isPending: isUpdatePending } =
		useUpdateEmployee();
	const employee =
		isSuccess && employeeData?.data && Boolean(id) ? employeeData?.data : null;
	const { register, handleSubmit, setValue } = useForm<Partial<Employee>>({
		defaultValues: employee
			? {
					name: employee?.name,
					cedula: employee?.cedula,
					startDate: format(employee?.startDate || new Date(), "yyyy-MM-dd"),
					jobPosition: employee?.jobPosition,
					department: employee?.department,
					salary: employee?.salary,
					candidateBackground: employee?.candidateBackground || null,
			  }
			: undefined,
	});

	const [hasCandidateBackground, setHasCandidateBackground] = useState(
		Boolean(employee?.candidateBackground)
	);

	const {
		data: jobPositionsData,
		setFilters: setJobPositionsFilters,
		isFetching: isFetchingJobPositions,
	} = useGetJobPositions();
	const [
		debouncedJobPositionSearchInput,
		jobPositionSearchInput,
		setJobPositionSearchInput,
	] = useDebounce(500, employee?.jobPosition?.name || "");

	useEffect(() => {
		setJobPositionsFilters({ name: debouncedJobPositionSearchInput });
	}, [debouncedJobPositionSearchInput, setJobPositionsFilters]);

	const {
		data: candidatesData,
		setFilters: setCandidatesFilters,
		isFetching: isFetchingCandidates,
	} = useGetCandidates();
	const [
		debouncedCandidateSearchInput,
		candidateSearchInput,
		setCandidateSearchInput,
	] = useDebounce(500, employee?.candidateBackground?.name || "");

	useEffect(() => {
		setCandidatesFilters({ name: debouncedCandidateSearchInput });
	}, [debouncedCandidateSearchInput, setCandidatesFilters]);
	const isEditing = Boolean(id);
	const onSubmit = async (data: Partial<Employee>) => {
		try {
			if (isEditing) {
				await onUpdate({
					...data,
					id: Number(id),
				});
			} else {
				await onAdd(data);
			}
			navigate("/employees");
		} catch (error) {
			console.error("Error saving employee:", error);
		}
	};
	if (isFetchingEmployee && Boolean(id)) {
		return (
			<NoDataScreen
				redirectPath="/employees"
				linkLabel={translate("common.goToEmployees")}
				isFetching={isFetchingEmployee}
			/>
		);
	}

	return (
		<ScreenWrapper
			title={translate(`employeeDetailsScreen.${isEditing ? "manage" : "add"}`)}
		>
			<Form
				className="flex flex-col gap-4 w-2/5"
				onSubmit={handleSubmit(onSubmit)}
			>
				<MagicInput
					{...register("cedula", { required: true, maxLength: 11 })}
					label={translate("cedula")}
					className="w-full"
					maxLength={11}
					type="text"
					defaultValue={employee?.cedula}
				/>
				<MagicInput
					{...register("name", { required: true, maxLength: 100 })}
					label={translate("name")}
					className="w-full"
					maxLength={100}
					type="text"
					defaultValue={employee?.name}
				/>
				<MagicDatePicker
					{...register("startDate", { required: true })}
					label={translate("startDate")}
					className="w-full"
					defaultVal={format(employee?.startDate || new Date(), "yyyy-MM-dd")}
					onChange={(date) => {
						setValue(
							"startDate",
							parseISO(
								date?.toString() || new Date().toISOString()
							).toISOString()
						);
					}}
				/>
				<Autocomplete
					label={translate("jobPosition")}
					className="w-full"
					onSelectionChange={(selectedKey) => {
						if (!selectedKey) return;
						const jobPosition = jobPositionsData?.data.find(
							(position) => position.id === Number(selectedKey)
						);
						if (jobPosition) {
							setValue("jobPosition", jobPosition);
						}
					}}
					defaultSelectedKey={employee?.jobPosition?.id}
					key={employee?.jobPosition?.id || "no-job-position"}
					isLoading={isFetchingJobPositions}
					inputValue={jobPositionSearchInput}
					onInputChange={(value) => {
						setJobPositionSearchInput(value);
					}}
				>
					{
						jobPositionsData?.data.map((position) => (
							<AutocompleteItem key={position.id}>
								{position.name}
							</AutocompleteItem>
						)) as any
					}
				</Autocomplete>
				<MagicSelect
					label={translate("department")}
					className="w-full"
					{...register("department", { required: true })}
					key={employee?.department}
					defaultSelectedKeys={
						employee?.department ? [employee.department] : undefined
					}
				>
					{Object.values(Departments).map((department) => (
						<SelectItem key={department}>{department}</SelectItem>
					))}
				</MagicSelect>
				<MagicInput
					{...register("salary", { required: true })}
					label={translate("salary")}
					className="w-full"
					type="number"
					defaultValue={employee?.salary?.toString()}
				/>
				<div className="flex flex-col gap-2 w-full">
					<Checkbox
						defaultSelected={hasCandidateBackground}
						onChange={(e) => {
							setHasCandidateBackground(e.target.checked);
						}}
					>
						{translate("hasCandidateBackground")}
					</Checkbox>
					<Autocomplete
						label={translate("candidateBackground")}
						className="w-full"
						key={employee?.jobPosition?.id}
						onSelectionChange={(selectedKeys) => {
							if (!selectedKeys) return;
							console.log(selectedKeys);
							const selectedCandidate = candidatesData?.data.find(
								(candidate) => candidate.id === selectedKeys[0]
							);
							if (selectedCandidate) {
								setValue("candidateBackground", selectedCandidate);
							}
						}}
						isDisabled={!hasCandidateBackground}
						isLoading={isFetchingCandidates}
						inputValue={candidateSearchInput}
						onInputChange={(value) => setCandidateSearchInput(value)}
					>
						{
							candidatesData?.data.map((position) => (
								<AutocompleteItem key={position.id}>
									{position.name}
								</AutocompleteItem>
							)) as any
						}
					</Autocomplete>
				</div>
				<div className="flex justify-end w-full">
					<Button
						variant="solid"
						color="primary"
						type="submit"
						endContent={<Save size={18} />}
						isLoading={isAddPending || isUpdatePending}
					>
						{translate(
							isAddPending || isUpdatePending ? "common.loading" : "common.save"
						)}
					</Button>
				</div>
			</Form>
		</ScreenWrapper>
	);
};

export default ManageEmployeeScreen;
