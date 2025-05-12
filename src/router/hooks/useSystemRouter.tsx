import { Languages, Sparkles } from "lucide-react";
import { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import ProficiencyList from "../../components/proficiency/ProficiencyList";
import LanguageList from "../../components/language/LanguageList";

export type ItemGrouper = {
	label: string;
	Icon: FC<React.SVGProps<SVGSVGElement>>;
	childrenPaths: RouteItem[];
	isHidden?: boolean;
};

export type RouteItem = {
	label: string;
	path: string;
	screen: React.ReactNode;
	isHidden?: boolean;
};

const useSystemRouter = () => {
	const { translate } = useLsmTranslation();
	const groupers: ItemGrouper[] = [
		{
			label: translate("proficiencies"),
			// TODO: MAKE THIS CUSTOMIZABLE
			Icon: (props) => <Sparkles {...props} />,
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "proficiencies",
					screen: <ProficiencyList />,
				},
				{
					label: translate("appDrawer.common.add"),
					path: "add-proficiency",
					screen: <div>add-proficiency</div>,
				},
			],
		},
		{
			label: translate("languages"),
			Icon: (props) => <Languages {...props} />,
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "languages",
					screen: <LanguageList />,
				},
				{
					label: translate("appDrawer.common.add"),
					path: "add-language",
					screen: <div>add-language</div>,
				},
			],
		},
	];

	const getRoutes = (): RouteItem[] => {
		const itemGroupers = groupers?.filter((item) => !item.isHidden);
		const actualRoutes = [...itemGroupers.flatMap((item) => item.childrenPaths)]
			.filter(Boolean)
			.filter((item) => !(item as RouteItem).isHidden) as RouteItem[];

		return actualRoutes;
	};

	const getNavigationItems = () => {
		const routes = groupers?.filter((item) => !item.isHidden);
		const actualRoutes = [...routes]
			.filter(Boolean)
			.filter((item) => !(item as ItemGrouper).isHidden);

		return actualRoutes;
	};

	return { getRoutes, getNavigationItems };
};

export default useSystemRouter;
