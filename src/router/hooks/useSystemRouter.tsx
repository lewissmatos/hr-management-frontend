import {
	GraduationCap,
	Languages,
	List,
	PlusCircle,
	Sparkles,
} from "lucide-react";
import { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import ProficiencyList from "../../components/proficiency/ProficiencyList";
import LanguageList from "../../components/language/LanguageList";
import TrainingsScreen from "../../components/training/TrainingsScreen";
import TrainingDetailsScreen from "../../components/training/TrainingDetailsScreen";

export type ItemGrouper = {
	label: string;
	Icon: FC<React.SVGProps<SVGSVGElement>>;
	childrenPaths: RouteItem[];
	isHidden?: boolean;
	showDivider?: boolean;
};

export type RouteItem = {
	label: string;
	path: string;
	screen: React.ReactNode;
	isHidden?: boolean;
	Icon?: FC<React.SVGProps<SVGSVGElement>>;
	hideFromDrawer?: boolean;
};

const useSystemRouter = () => {
	const { translate } = useLsmTranslation();
	const groupers: ItemGrouper[] = [
		{
			label: translate("proficiencies"),
			Icon: (props) => <Sparkles {...props} />,
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "proficiencies",
					screen: <ProficiencyList />,
					Icon: (props) => <List {...props} />,
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
					Icon: (props) => <List {...props} />,
				},
			],
			showDivider: true,
		},
		{
			label: translate("trainings"),
			Icon: (props) => <GraduationCap {...props} />,
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "trainings",
					screen: <TrainingsScreen />,
					Icon: (props) => <List {...props} />,
				},
				{
					label: translate("appDrawer.common.add"),
					path: "training",
					screen: <TrainingDetailsScreen />,
					Icon: (props) => <PlusCircle {...props} />,
				},
				{
					label: translate("appDrawer.common.add"),
					path: "training/:id",
					screen: <TrainingDetailsScreen />,
					Icon: (props) => <PlusCircle {...props} />,
					hideFromDrawer: true,
				},
			],
			showDivider: true,
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
