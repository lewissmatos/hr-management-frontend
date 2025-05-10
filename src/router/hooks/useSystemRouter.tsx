import { FC } from "react";

type RouteItem = {
	label: string;
	Icon: FC<React.SVGProps<SVGSVGElement>>;
	path: string;
	subPaths?: RouteItem[];
	screen: React.ReactNode;
	isHidden?: boolean;
};

const useSystemRouter = () => {
	const authenticatedPaths: RouteItem[] = [];

	const getRoutes = (): RouteItem[] => {
		const routes = authenticatedPaths?.filter((item) => !item.isHidden);
		const actualRoutes = [...routes, ...routes.flatMap((item) => item.subPaths)]
			.filter(Boolean)
			.filter((item) => !(item as RouteItem).isHidden) as RouteItem[];

		return actualRoutes;
	};

	const getHeaderItems = () => {
		const routes = authenticatedPaths?.filter((item) => !item.isHidden);
		const actualRoutes = [...routes]
			.filter(Boolean)
			.filter((item) => !(item as RouteItem).isHidden);

		return actualRoutes;
	};

	return { getRoutes, getHeaderItems };
};

export default useSystemRouter;
