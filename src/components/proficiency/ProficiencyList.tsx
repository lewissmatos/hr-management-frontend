import React from "react";
import {
	useAddProficiency,
	useGetProficiencies,
	useToggleStatusProficiency,
	useUpdateProficiency,
} from "../../features/service-hooks/useProficiencyService";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import GenericListCard from "../common/GenericListCard";
import BasicInputEntityAdder from "../common/BasicInputEntityAdder";

const ProficiencyList = () => {
	const { translate } = useLsmTranslation();
	const { data, refetch, isLoading: isFetching } = useGetProficiencies();

	const {
		mutateAsync: onUpdateDescription,
		isPending: isUpdateDescriptionPending,
	} = useUpdateProficiency();
	const { mutateAsync: updateProficiency, isPending: isAddProficiencyPending } =
		useAddProficiency();

	const list = data?.data;

	return (
		<ScreenWrapper
			title={translate("proficiencies")}
			headerOptions={
				<BasicInputEntityAdder
					useAddEntity={() => ({
						mutateAsync: async (data) => {
							await updateProficiency({ description: data.label });
							await refetch();
						},
						isPending: isAddProficiencyPending,
					})}
				/>
			}
		>
			{list?.length ? (
				<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
					{list.map(({ description, isActive, createdAt, id }) => (
						<GenericListCard
							key={id}
							id={id}
							label={description}
							isActive={isActive}
							createdAt={createdAt}
							useToggleStatus={useToggleStatusProficiency as any}
							refetch={refetch as any}
							updateData={{
								isPending: isUpdateDescriptionPending,
								updateLabel: async (id, newDescription) => {
									await onUpdateDescription({
										id,
										description: newDescription,
									});
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
