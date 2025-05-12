import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import { Card, CardHeader, Divider, CardFooter } from "@heroui/react";
import { format } from "date-fns";
import ToggleStatusButton from "../ui/ToggleStatusButton";
import NoDataScreen from "../ui/NoDataScreen";
import {
	useGetLanguages,
	useToggleStatusLanguage,
} from "../../features/service-hooks/useLanguageService";

const LanguageList = () => {
	const { translate } = useLsmTranslation();
	const { data, refetch, isLoading: isFetching } = useGetLanguages();
	const { mutateAsync: toggleStatus, isPending: isToggleStatusPending } =
		useToggleStatusLanguage();
	const proficiencyList = data?.data.data;

	return (
		<ScreenWrapper title={translate("proficiencies")}>
			{proficiencyList?.length ? (
				<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
					{proficiencyList.map(({ name, isActive, createdAt, id }) => (
						<Card className="min-w-[300px]" shadow="sm">
							<CardHeader className="flex gap-3">
								<div className="flex flex-col">
									<p
										className={`text-lg font-semibold ${
											!isActive ? "text-foreground-500 opacity-60" : ""
										}`}
									>
										{name}
									</p>
								</div>
							</CardHeader>
							<Divider />
							<CardFooter className="flex flex-row gap-2 justify-between items-center">
								<p className="text-sm text-foreground-500">
									{translate("addedAt", {
										replace: {
											values: {
												date: format(createdAt, "dd-MM-yyyy"),
											},
										},
									})}
								</p>
								<ToggleStatusButton
									isLoading={isToggleStatusPending}
									isActive={isActive}
									onPress={async () => {
										await toggleStatus(id);
										await refetch();
									}}
								/>
							</CardFooter>
						</Card>
					))}
				</div>
			) : (
				<NoDataScreen isFetching={isFetching} />
			)}
		</ScreenWrapper>
	);
};

export default LanguageList;
