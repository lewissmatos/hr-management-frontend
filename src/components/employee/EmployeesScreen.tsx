import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useGetEmployees } from "../../features/service-hooks/useEmployeeService";
import { MagicIconButton, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Employee } from "../../types/app-types";
import { CircleDollarSign, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import useDebounce from "../../hooks/useDebounce";
import { useMemo } from "react";

const EmployeesScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const [debouncedSearchInput, setSearchInput] = useDebounce();
	const [debouncedStartDate, setDebouncedStartDate, startDate] = useDebounce();
	const [debouncedEndDate, setDebouncedEndDate, endDate] = useDebounce();
	const [debouncedStartSalaryInput, setStartSalaryInput] = useDebounce();
	const [debouncedEndSalaryInput, setEndSalaryInput] = useDebounce();

	const { data, isFetching } = useGetEmployees({
		searchParam: debouncedSearchInput,
		startDate: debouncedStartDate,
		endDate: debouncedEndDate,
		startSalary: debouncedStartSalaryInput,
		endSalary: debouncedEndSalaryInput,
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
					<span className="text-md">{employee.jobPosition.name}</span>
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
		<ScreenWrapper title={translate("employees")}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<GenericSearchByQueryInput
						properties={["cedula", "name", "jobPosition", "department"]}
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
