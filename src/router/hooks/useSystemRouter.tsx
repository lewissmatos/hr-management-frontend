import { UserPlus } from "lucide-react";
import { FC } from "react";

export type RouteItem = {
	label: string;
	Icon: FC<React.SVGProps<SVGSVGElement>>;
	path: string;
	subPaths?: RouteItem[];
	screen: React.ReactNode;
	isHidden?: boolean;
};

const useSystemRouter = () => {
	const authenticatedPaths: RouteItem[] = [
		{
			label: "Candidates",
			Icon: () => <UserPlus size={18} />,
			path: "candidates",
			screen: <div>Candidates</div>,
		},
	];

	const getRoutes = (): RouteItem[] => {
		const routes = authenticatedPaths?.filter((item) => !item.isHidden);
		const actualRoutes = [...routes, ...routes.flatMap((item) => item.subPaths)]
			.filter(Boolean)
			.filter((item) => !(item as RouteItem).isHidden) as RouteItem[];

		return actualRoutes;
	};

	const getNavigationItems = () => {
		const routes = authenticatedPaths?.filter((item) => !item.isHidden);
		const actualRoutes = [...routes]
			.filter(Boolean)
			.filter((item) => !(item as RouteItem).isHidden);

		return actualRoutes;
	};

	return { getRoutes, getNavigationItems };
};

export default useSystemRouter;
