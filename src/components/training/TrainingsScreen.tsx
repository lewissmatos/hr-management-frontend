import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useGetTrainings } from "../../features/service-hooks/useTrainingService";
import { MagicIconButton, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Training } from "../../types/app-types";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrainingsScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const { data, isFetching } = useGetTrainings();
	const list = data?.data;
	const columns = [
		{
			element: "description",
			selector: (training: Training) => (
				<span className="font-semibold text-md">{training.name}</span>
			),
		},
		{
			element: "level",
			selector: (training: Training) => (
				<span className=" text-md">{training.level.toString()}</span>
			),
		},
		{
			element: "startDate",
			selector: (training: Training) => (
				<span className=" text-md">
					{format(training.startDate, "dd-MM-yyyy")}
				</span>
			),
		},
		{
			element: "endDate",
			selector: (training: Training) => (
				<span className=" text-md">
					{format(training.endDate, "dd-MM-yyyy")}
				</span>
			),
		},
		{
			element: "institution",
			selector: (training: Training) => (
				<span className=" text-md">{training.institution.toUpperCase()}</span>
			),
		},
		{
			element: "common.actions",
			selector: (training: Training) => (
				<div className="flex gap-2">
					<MagicIconButton
						size="sm"
						variant="flat"
						onPress={() => {
							navigate(`/training/${training.id}`);
						}}
					>
						<Pencil size={18} />
					</MagicIconButton>
				</div>
			),
		},
	];

	return (
		<ScreenWrapper title={translate("trainings")}>
			{list?.length ? (
				<MagicTable<Training>
					columns={columns as any}
					data={list as []}
					selectionMode="none"
					isStriped
				/>
			) : (
				<NoDataScreen
					isFetching={isFetching}
					redirectPath="/training"
					elementName="training"
				/>
			)}
		</ScreenWrapper>
	);
};

export default TrainingsScreen;
