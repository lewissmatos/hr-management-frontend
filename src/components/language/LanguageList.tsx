import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import {
	useAddLanguage,
	useGetLanguages,
	useToggleStatusLanguage,
	useUpdateLanguage,
} from "../../features/service-hooks/useLanguageService";
import GenericListCard from "../common/GenericListCard";
import BasicInputEntityAdder from "../common/BasicInputEntityAdder";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import GenericBooleanQueryHandler from "../common-filters/GenericBooleanQueryHandler";
import { useState } from "react";

const LanguageList = () => {
	const { translate } = useLsmTranslation();

	const [filters, setFilters] = useState<{
		description: string;
		isActive: boolean[] | undefined;
	}>({
		description: "",
		isActive: [true, false],
	});
	const {
		data,
		refetch,
		isLoading: isFetching,
	} = useGetLanguages({ ...filters });

	const { mutateAsync: onUpdateName, isPending: isUpdateNamePending } =
		useUpdateLanguage();

	const { mutateAsync: addLanguage, isPending: isAddingLanguage } =
		useAddLanguage();

	const list = data?.data;

	return (
		<ScreenWrapper
			title={translate("languages")}
			headerOptions={
				<BasicInputEntityAdder
					useAddEntity={() => ({
						mutateAsync: async (data) => {
							await addLanguage({ name: data.label });
							await refetch();
						},
						isPending: isAddingLanguage,
					})}
				/>
			}
		>
			<div className="flex flex-row gap-4">
				<GenericSearchByQueryInput
					properties={["name"]}
					isLoading={isFetching}
					setQuery={(query) => {
						setFilters((prev) => ({
							...prev,
							name: query,
						}));
					}}
				/>
				<GenericBooleanQueryHandler
					label={translate("status")}
					setQuery={(values) => {
						setFilters((prev) => ({
							...prev,
							isActive: values,
						}));
					}}
				/>
			</div>
			{list?.length ? (
				<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
					{list.map(({ name, isActive, id, createdAt }) => (
						<GenericListCard
							key={id}
							id={id}
							label={name}
							isActive={isActive}
							createdAt={createdAt}
							updateData={{
								isPending: isUpdateNamePending,
								updateLabel: async (id, newName) => {
									await onUpdateName({ id, name: newName });
									await refetch();
								},
							}}
							useToggleStatus={useToggleStatusLanguage as any}
							refetch={refetch as any}
						/>
					))}
				</div>
			) : (
				<NoDataScreen isFetching={isFetching} />
			)}
		</ScreenWrapper>
	);
};

export default LanguageList;
