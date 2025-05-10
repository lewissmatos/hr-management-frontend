import { Navigate, Route, Routes } from "react-router-dom";
import LoginScreen from "../components/login/LoginScreen";

const UnauthenticatedRoutes = () => {
	return (
		<Routes>
			<Route path="/*" element={<Navigate to="/login" replace />} />
			<Route path={`/login`} element={<LoginScreen />} />
			<Route path={`/apply-jobs`} element={"Jobs"} />
		</Routes>
	);
};

export default UnauthenticatedRoutes;
