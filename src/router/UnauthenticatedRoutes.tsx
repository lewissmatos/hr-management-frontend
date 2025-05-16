import { Navigate, Route, Routes } from "react-router-dom";
import LoginScreen from "../components/login/LoginScreen";
import JobsForCandidatesScreen from "../components/jobs-for-candidates/JobsForCandidatesScreen";
import JobPositionDetailsScreen from "../components/jobs-for-candidates/JobPositionDetailsScreen";

const UnauthenticatedRoutes = () => {
	return (
		<Routes>
			<Route path="/*" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<LoginScreen />} />
			<Route path="/apply/jobs" element={<JobsForCandidatesScreen />} />
			<Route
				path="/jobs-for-candidates/apply/:id"
				element={<JobPositionDetailsScreen />}
			/>
		</Routes>
	);
};

export default UnauthenticatedRoutes;
