import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import { Button, Checkbox, Form, SelectItem } from "@heroui/react";
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
import { useState } from "react";
import { useGetCandidates } from "../../features/service-hooks/useCandidateService";

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
			  }
			: undefined,
	});

	const [hasCandidateBackground, setHasCandidateBackground] = useState(
		Boolean(employee?.candidateBackground)
	);
	const { data: jobPositionsData } = useGetJobPositions();
	const { data: candidatesData } = useGetCandidates();

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
				className="flex flex-col gap-4  max-w-[40%]"
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
				<MagicSelect
					label={translate("jobPosition")}
					className="w-full"
					{...register("jobPosition", { required: true })}
					key={employee?.jobPosition?.id}
					defaultSelectedKeys={
						employee?.jobPosition.id ? [employee.jobPosition.id] : undefined
					}
				>
					{
						jobPositionsData?.data.map((position) => (
							<SelectItem key={position.id}>{position.name}</SelectItem>
						)) as any
					}
				</MagicSelect>
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

					<MagicSelect
						isDisabled={!hasCandidateBackground}
						label={translate("candidateBackground")}
						className="w-full"
						{...register("candidateBackground", { required: true })}
						key={employee?.candidateBackground?.id}
						defaultSelectedKeys={
							employee?.candidateBackground.id
								? [employee.candidateBackground.id]
								: undefined
						}
					>
						{
							candidatesData?.data.map((candidate) => (
								<SelectItem key={candidate.id}>{candidate.name}</SelectItem>
							)) as any
						}
					</MagicSelect>
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
