import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import { Button, Form, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Training, TrainingLevels } from "../../types/app-types";
import { useNavigate, useParams } from "react-router-dom";
import { MagicDateRangePicker, MagicInput, MagicSelect } from "../ui";
import { format, parseISO } from "date-fns";
import {
	useAddTraining,
	useGetTraining,
	useUpdateTraining,
} from "../../features/service-hooks/useTrainingService";
import { Save } from "lucide-react";
import NoDataScreen from "../ui/NoDataScreen";

const ManageTrainingScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const id = useParams<{ id?: string }>()?.id;
	const {
		data,
		isSuccess,
		isPending: isFetchingTraining,
	} = useGetTraining(Number(id));
	const { mutateAsync: onAdd, isPending: isAddPending } = useAddTraining();
	const { mutateAsync: onUpdate, isPending: isUpdatePending } =
		useUpdateTraining();
	const training = isSuccess && data?.data && Boolean(id) ? data?.data : null;
	const { register, handleSubmit, setValue } = useForm<Partial<Training>>({
		defaultValues: training
			? {
					name: training?.name,
					level: training?.level,
					startDate: training?.startDate,
					endDate: training?.endDate,
					institution: training?.institution,
			  }
			: undefined,
	});

	const isEditing = Boolean(id);
	const onSubmit = async (data: Partial<Training>) => {
		try {
			if (isEditing) {
				await onUpdate({
					...data,
					id: Number(id),
				});
			} else {
				await onAdd(data);
			}
			navigate("/trainings");
		} catch (error) {
			console.error("Error saving training:", error);
		}
	};
	if (isFetchingTraining && Boolean(id)) {
		return (
			<NoDataScreen
				redirectPath="/trainings"
				linkLabel={translate("common.goToTrainings")}
				isFetching={isFetchingTraining}
			/>
		);
	}

	return (
		<ScreenWrapper
			title={translate(`trainingDetailsScreen.${isEditing ? "manage" : "add"}`)}
		>
			<Form
				className="flex flex-col gap-4 w-2/5"
				onSubmit={handleSubmit(onSubmit)}
			>
				<MagicInput
					{...register("name", { required: true })}
					label={translate("description")}
					className="w-full"
					type="text"
					defaultValue={training?.name}
				/>
				<MagicSelect
					label={translate("level")}
					className="w-full"
					{...register("level", { required: true })}
					key={training?.level}
					defaultSelectedKeys={training?.level ? [training.level] : undefined}
				>
					{Object.values(TrainingLevels).map((level) => (
						<SelectItem key={level}>{level}</SelectItem>
					))}
				</MagicSelect>
				<MagicDateRangePicker
					label={translate("common.dateRange")}
					defaultVals={{
						startDate: format(training?.startDate || new Date(), "yyyy-MM-dd"),
						endDate: format(training?.endDate || new Date(), "yyyy-MM-dd"),
					}}
					size="md"
					onChange={(value) => {
						const { startDate, endDate } = {
							startDate: parseISO(
								value?.start.toString() || new Date().toISOString()
							).toISOString(),
							endDate: parseISO(
								value?.end.toString() || new Date().toISOString()
							).toISOString(),
						};
						setValue("startDate", startDate);
						setValue("endDate", endDate);
					}}
					visibleMonths={3}
				/>
				<MagicInput
					label={translate("institution")}
					className="w-full"
					{...register("institution", { required: true })}
					defaultValue={training?.institution}
				/>
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

export default ManageTrainingScreen;
