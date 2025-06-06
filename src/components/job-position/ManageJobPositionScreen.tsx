import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import { Button, Form, SelectItem, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import {
	Departments,
	JobPosition,
	JobPositionRiskLevels,
} from "../../types/app-types";
import { useNavigate, useParams } from "react-router-dom";
import { MagicIconButton, MagicInput, MagicSelect } from "../ui";
import {
	useAddJobPosition,
	useGetJobPosition,
	useUpdateJobPosition,
} from "../../features/service-hooks/useJobPositionService";
import { Ban, RefreshCcw, Save } from "lucide-react";
import NoDataScreen from "../ui/NoDataScreen";

const DESCRIPTION_MAX_LENGTH = 3100;

const ManageJobPositionScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const id = useParams<{ id?: string }>()?.id;
	const {
		data,
		isSuccess,
		isPending: isFetchingJobPosition,
	} = useGetJobPosition(Number(id));
	const { mutateAsync: onAdd, isPending: isAddPending } = useAddJobPosition();

	const { mutateAsync: onUpdate, isPending: isUpdatePending } =
		useUpdateJobPosition();
	const jobPosition =
		isSuccess && data?.data && Boolean(id) ? data?.data : null;

	const { register, handleSubmit, setValue, watch } = useForm<
		Partial<JobPosition>
	>({
		defaultValues: jobPosition
			? {
					name: jobPosition?.name,
					riskLevel: jobPosition?.riskLevel,
					minSalary: jobPosition?.minSalary,
					maxSalary: jobPosition?.maxSalary,
					isAvailable: jobPosition?.isAvailable,
			  }
			: undefined,
	});

	const isEditing = Boolean(id);

	const isJobPositionAvailable =
		jobPosition?.isAvailable !== undefined
			? jobPosition?.isAvailable
			: watch("isAvailable");
	const onSubmit = async (data: Partial<JobPosition>) => {
		try {
			if (isEditing) {
				await onUpdate({
					...data,
					id: Number(id),
				});
			} else {
				await onAdd(data);
			}
			navigate("/job-positions");
		} catch (error) {
			console.error("Error saving jobPosition:", error);
		}
	};
	if (isFetchingJobPosition && Boolean(id)) {
		return (
			<NoDataScreen
				redirectPath="/job-positions"
				linkLabel={translate("common.goToJobPositions")}
				isFetching={isFetchingJobPosition}
			/>
		);
	}

	return (
		<ScreenWrapper
			title={translate(
				`manageJobPositionScreen.${isEditing ? "manage" : "add"}`
			)}
		>
			<Form
				className="flex flex-col gap-4  max-w-[40%]"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex gap-2 items-center justify-between w-full">
					<MagicInput
						{...register("name", { required: true })}
						label={translate("description")}
						className="w-full"
						type="text"
						defaultValue={jobPosition?.name}
					/>
					{isEditing && (
						<MagicIconButton
							tooltipProps={{
								content: isJobPositionAvailable
									? translate("common.markAsUnavailable")
									: translate("common.markAsAvailable"),
								color: isJobPositionAvailable ? "danger" : "success",
							}}
							size="lg"
							variant="flat"
							onPress={() => {
								setValue("isAvailable", !isJobPositionAvailable);
							}}
						>
							{isJobPositionAvailable ? (
								<Ban size={24} className="text-red-500" />
							) : (
								<RefreshCcw size={24} className="text-green-500" />
							)}
						</MagicIconButton>
					)}
				</div>
				<div className="w-full flex flex-row gap-2">
					<MagicSelect
						label={translate("riskLevel")}
						className="w-full"
						{...register("riskLevel", { required: true })}
						key={jobPosition?.riskLevel}
						defaultSelectedKeys={
							jobPosition?.riskLevel ? [jobPosition.riskLevel] : undefined
						}
					>
						{Object.values(JobPositionRiskLevels).map((riskLevel) => (
							<SelectItem key={riskLevel}>{riskLevel}</SelectItem>
						))}
					</MagicSelect>
					<MagicSelect
						label={translate("department")}
						className="w-full"
						{...register("department", { required: true })}
						key={jobPosition?.department}
						defaultSelectedKeys={
							jobPosition?.department ? [jobPosition.department] : undefined
						}
					>
						{Object.values(Departments).map((department) => (
							<SelectItem key={department}>{department}</SelectItem>
						))}
					</MagicSelect>
				</div>
				<div className="w-full flex flex-row gap-2">
					<MagicInput
						{...register("minSalary", { required: true })}
						label={translate("minSalary")}
						className="w-full"
						type="number"
						defaultValue={jobPosition?.minSalary?.toString()}
					/>
					<MagicInput
						{...register("maxSalary", { required: true })}
						label={translate("maxSalary")}
						className="w-full"
						type="number"
						defaultValue={jobPosition?.maxSalary?.toString()}
					/>
				</div>
				<Textarea
					{...register("description", {
						required: true,
						maxLength: DESCRIPTION_MAX_LENGTH,
					})}
					label={translate("description")}
					isRequired
					className="w-full "
					classNames={{
						input: "min-h-[400px]",
					}}
					maxLength={DESCRIPTION_MAX_LENGTH}
					defaultValue={jobPosition?.description}
				/>
				<div className="w-full flex flex-row items-center justify-end  text-foreground-500 ">
					<p className="text-sm">
						{(watch("description") || "")?.length > DESCRIPTION_MAX_LENGTH
							? translate("common.maxLengthExceeded", {
									replace: { values: { maxLength: DESCRIPTION_MAX_LENGTH } },
							  })
							: `${
									watch("description")?.length || 0
							  } / ${DESCRIPTION_MAX_LENGTH}`}
					</p>
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

export default ManageJobPositionScreen;
