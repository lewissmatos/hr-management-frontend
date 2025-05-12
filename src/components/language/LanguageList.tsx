import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import {
	useGetLanguages,
	useUpdateLanguage,
} from "../../features/service-hooks/useLanguageService";
import GenericListCard from "../common/GenericListCard";

const LanguageList = () => {
	const { translate } = useLsmTranslation();
	const { data, isLoading: isFetching } = useGetLanguages();

	const { mutateAsync: updateName, isPending: isUpdateNamePending } =
		useUpdateLanguage();
	console.log(data);

	const list = data?.data;

	return (
		<ScreenWrapper title={translate("languages")}>
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
									await updateName({ id, name: newName });
								},
							}}
							hideDisable
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
