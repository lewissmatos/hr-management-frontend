import React from "react";
import {
	useGetProficiencies,
	useToggleStatusProficiency,
	useUpdateProficiency,
} from "../../features/service-hooks/useProficiencyService";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import GenericListCard from "../common/GenericListCard";

const ProficiencyList = () => {
	const { translate } = useLsmTranslation();
	const { data, refetch, isLoading: isFetching } = useGetProficiencies();

	const { mutateAsync: toggleStatus, isPending: isToggleStatusPending } =
		useToggleStatusProficiency();
	const {
		mutateAsync: updateDescription,
		isPending: isUpdateDescriptionPending,
	} = useUpdateProficiency();

	const list = data?.data;

	return (
		<ScreenWrapper title={translate("proficiencies")}>
			{list?.length ? (
				<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
					{list.map(({ description, isActive, createdAt, id }) => (
						<GenericListCard
							key={id}
							id={id}
							label={description}
							isActive={isActive}
							createdAt={createdAt}
							disableData={{
								isPending: isToggleStatusPending,
								toggleStatus: async (id) => {
									await toggleStatus(id);
									refetch();
								},
							}}
							updateData={{
								isPending: isUpdateDescriptionPending,
								updateLabel: async (id, newDescription) => {
									await updateDescription({ id, description: newDescription });
									refetch();
								},
							}}
						/>
					))}
				</div>
			) : (
				<NoDataScreen isFetching={isFetching} />
			)}
		</ScreenWrapper>
	);
};

export default ProficiencyList;
