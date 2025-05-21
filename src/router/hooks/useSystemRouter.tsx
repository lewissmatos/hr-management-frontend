import {
	BriefcaseBusiness,
	FileSliders,
	GraduationCap,
	Languages,
	Rows4,
	Sparkles,
	SquareUserRound,
	User,
} from "lucide-react";
import { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import ProficiencyList from "../../components/proficiency/ProficiencyList";
import LanguageList from "../../components/language/LanguageList";
import TrainingsScreen from "../../components/training/TrainingsScreen";
import ManageTrainingScreen from "../../components/training/ManageTrainingScreen";
import CandidatesScreen from "../../components/candidate/CandidatesScreen";
import JobPositionsScreen from "../../components/job-position/JobPositionsScreen";
import ManageJobPositionScreen from "../../components/job-position/ManageJobPositionScreen";
import ManageEmployeeScreen from "../../components/employee/ManageEmployeeScreen";
import EmployeesScreen from "../../components/employee/EmployeesScreen";
import JobPositionInfoScreen from "../../components/job-position/JobPositionInfoScreen";
import CandidateInformationScreen from "../../components/candidate/CandidateInformationScreen";
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
					Icon: (props) => <Rows4 {...props} />,
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
					Icon: (props) => <Rows4 {...props} />,
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
					Icon: (props) => <Rows4 {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "training",
					screen: <ManageTrainingScreen />,
					Icon: (props) => <FileSliders {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "training/:id",
					screen: <ManageTrainingScreen />,
					Icon: (props) => <FileSliders {...props} />,
					hideFromDrawer: true,
				},
			],
		},
		{
			label: translate("employees"),
			Icon: (props) => <SquareUserRound {...props} />,
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "employees",
					screen: <EmployeesScreen />,
					Icon: (props) => <Rows4 {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "employee",
					screen: <ManageEmployeeScreen />,
					Icon: (props) => <FileSliders {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "employee/:id",
					screen: <ManageEmployeeScreen />,
					Icon: (props) => <FileSliders {...props} />,
					hideFromDrawer: true,
				},
			],
			showDivider: true,
		},
		{
			label: translate("jobPositions"),
			Icon: (props) => {
				return <BriefcaseBusiness {...props} />;
			},
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "job-positions",
					screen: <JobPositionsScreen />,
					Icon: (props) => <Rows4 {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "job-position",
					screen: <ManageJobPositionScreen />,
					Icon: (props) => <FileSliders {...props} />,
				},

				{
					label: translate("appDrawer.common.manage"),
					path: "job-position/:id",
					screen: <ManageJobPositionScreen />,
					Icon: (props) => <FileSliders {...props} />,
					hideFromDrawer: true,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "job-position/details/:id",
					screen: <JobPositionInfoScreen />,
					Icon: (props) => <FileSliders {...props} />,
					hideFromDrawer: true,
				},
			],
		},
		{
			label: translate("candidates"),
			Icon: (props) => {
				return <User {...props} />;
			},
			childrenPaths: [
				{
					label: translate("appDrawer.common.list"),
					path: "candidates",
					screen: <CandidatesScreen />,
					Icon: (props) => <Rows4 {...props} />,
				},
				{
					label: translate("appDrawer.common.manage"),
					path: "candidate/:id",
					screen: <CandidateInformationScreen />,
					Icon: (props) => <FileSliders {...props} />,
					hideFromDrawer: true,
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
