import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useGetTrainings } from "../../features/service-hooks/useTrainingService";
import { MagicIconButton, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Training } from "../../types/app-types";
import { format } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import useDebounce from "../../hooks/useDebounce";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import { useMemo } from "react";
import { Button } from "@heroui/react";

const TrainingsScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const [debouncedSearchInput, setSearchInput] = useDebounce();

	const [debouncedStartDate, setDebouncedStartDate, startDate] = useDebounce();
	const [debouncedEndDate, setDebouncedEndDate, endDate] = useDebounce();
	const { data, isFetching } = useGetTrainings({
		searchParam: debouncedSearchInput,
		startDate: debouncedStartDate,
		endDate: debouncedEndDate,
	});

	const list = data?.data;
	const columns = useMemo(
		() => [
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
		],
		[navigate]
	);

	return (
		<ScreenWrapper
			title={translate("trainings")}
			headerOptions={
				<Button
					variant="solid"
					color="primary"
					onPress={() => navigate("/training")}
					endContent={<PlusCircle />}
				>
					{translate("common.add")}
				</Button>
			}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<GenericSearchByQueryInput
						properties={["name", "level", "institution"]}
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
				</div>
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
			</div>
		</ScreenWrapper>
	);
};

export default TrainingsScreen;
