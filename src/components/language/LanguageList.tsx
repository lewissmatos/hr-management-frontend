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

const LanguageList = () => {
	const { translate } = useLsmTranslation();
	const { data, refetch, isLoading: isFetching } = useGetLanguages();
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
