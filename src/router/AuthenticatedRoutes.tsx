import { Navigate, Route, Routes } from "react-router-dom";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import useSystemRouter from "./hooks/useSystemRouter";

const AuthenticatedRoutes = () => {
	const { getRoutes } = useSystemRouter();

	const homePath = "/candidates";
	const actualRoutes = getRoutes();
	return (
		<>
			<Routes>
				<Route path="/*" element={<Navigate to={homePath} replace />} />

				<Route path="/" element={<AuthenticatedLayout />}>
					<Route path="/*" element={<Navigate to={homePath} replace />} />
					{actualRoutes.map((item, index) => {
						return (
							<Route key={index} path={`/${item.path}`} element={item.screen} />
						);
					})}
				</Route>
				<Route path="/" element={<Navigate to={homePath} replace />} />
			</Routes>
		</>
	);
};

export default AuthenticatedRoutes;
