import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useGetEmployees } from "../../features/service-hooks/useEmployeeService";
import { MagicIconButton, MagicSelect, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Departments, Employee } from "../../types/app-types";
import { CircleDollarSign, Pencil, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import useDebounce from "../../hooks/useDebounce";
import { useMemo, useState } from "react";
import { Button, SelectItem } from "@heroui/react";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import LazyAutocompleteQuery from "../common-filters/LazyAutocompleteQuery";

const EmployeesScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const [debouncedSearchInput, setSearchInput] = useDebounce();
	const [debouncedStartDate, setDebouncedStartDate, startDate] = useDebounce();
	const [debouncedEndDate, setDebouncedEndDate, endDate] = useDebounce();
	const [debouncedStartSalaryInput, setStartSalaryInput] = useDebounce();
	const [debouncedEndSalaryInput, setEndSalaryInput] = useDebounce();

	const [otherFilters, setOtherFilters] = useState({
		jobPosition: "",
		department: "",
	});
	const { data, isFetching } = useGetEmployees({
		searchParam: debouncedSearchInput,
		startDate: debouncedStartDate,
		endDate: debouncedEndDate,
		startSalary: debouncedStartSalaryInput,
		endSalary: debouncedEndSalaryInput,
		...otherFilters,
	});
	const list = data?.data;

	const columns = useMemo(
		() => [
			{
				element: "cedula",
				selector: (employee: Employee) => (
					<span className="font-semibold text-md">{employee.cedula}</span>
				),
			},
			{
				element: "name",
				selector: (employee: Employee) => (
					<span className="text-md">{employee.name}</span>
				),
			},
			{
				element: "startDate",
				selector: (employee: Employee) => (
					<span className=" text-md">
						{format(employee.startDate, "dd-MM-yyyy")}
					</span>
				),
			},
			{
				element: "jobPosition",
				selector: (employee: Employee) => (
					<span
						className="text-md font-semibold hover:underline cursor-pointer"
						onClick={() => {
							navigate(`/job-position/${employee.jobPosition.id}`);
						}}
					>
						{employee.jobPosition.name}
					</span>
				),
			},
			{
				element: "department",
				selector: (employee: Employee) => (
					<span className="text-md">{employee.department}</span>
				),
			},
			{
				element: "salary",
				selector: (employee: Employee) => (
					<span className="text-md">
						{formatCurrency(Number(employee.salary))}
					</span>
				),
			},
			{
				element: "hasCandidateBackground",
				selector: (employee: Employee) => (
					<span className="text-md">
						{employee.candidateBackground
							? translate("common.yes")
							: translate("common.no")}
					</span>
				),
			},
			{
				element: "common.actions",
				selector: (employee: Employee) => (
					<div className="flex gap-2">
						<MagicIconButton
							size="sm"
							variant="flat"
							onPress={() => {
								navigate(`/employee/${employee.id}`);
							}}
						>
							<Pencil size={18} />
						</MagicIconButton>
					</div>
				),
			},
		],
		[navigate]
	);

	return (
		<ScreenWrapper
			title={translate("employees")}
			headerOptions={
				<Button
					variant="solid"
					color="primary"
					onPress={() => navigate("/employee")}
					endContent={<PlusCircle />}
				>
					{translate("common.add")}
				</Button>
			}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<GenericSearchByQueryInput
						properties={["cedula", "name"]}
						isLoading={isFetching}
						setQuery={(query) => {
							setSearchInput(query);
						}}
					/>
					<GenericDateQuery
						paramName="startDate"
						date={startDate}
						setDebouncedDate={setDebouncedStartDate}
						isLoading={isFetching}
					/>

					<GenericDateQuery
						paramName="endDate"
						date={endDate}
						setDebouncedDate={setDebouncedEndDate}
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
							setStartSalaryInput(query);
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
							setEndSalaryInput(query);
						}}
						overrideLabel={translate("endSalary")}
					/>
					<LazyAutocompleteQuery
						key="job-position-name"
						setSelectedValue={(val) => {
							if (!val) return;
							setOtherFilters((prev) => ({
								...prev,
								jobPosition: val,
							}));
						}}
						displayPropName="name"
						labelKey="jobPosition"
						className="w-1/6"
						useQueryHook={useGetJobPositions as any}
					/>
					<MagicSelect
						label={translate("department")}
						onSelectionChange={(selectedKeys) => {
							if (!selectedKeys) return;
							setOtherFilters((prev) => ({
								...prev,
								department: selectedKeys[0],
							}));
						}}
						className="w-1/6"
					>
						{Object.values(Departments).map((department) => (
							<SelectItem key={department}>{department}</SelectItem>
						))}
					</MagicSelect>
				</div>

				{list?.length ? (
					<MagicTable<Employee>
						columns={columns as any}
						data={list as []}
						selectionMode="none"
						isStriped
					/>
				) : (
					<NoDataScreen
						isFetching={isFetching}
						redirectPath="/employee"
						elementName="employee"
					/>
				)}
			</div>
		</ScreenWrapper>
	);
};

export default EmployeesScreen;
