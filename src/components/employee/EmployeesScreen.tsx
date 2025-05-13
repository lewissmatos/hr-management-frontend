import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useGetEmployees } from "../../features/service-hooks/useEmployeeService";
import { MagicIconButton, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Employee } from "../../types/app-types";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";

const EmployeesScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const { data, isFetching } = useGetEmployees();
	const list = data?.data;
	// 	candidateBackground: Candidate;
	const columns = [
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
	];

	return (
		<ScreenWrapper title={translate("employees")}>
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
		</ScreenWrapper>
	);
};

export default EmployeesScreen;
