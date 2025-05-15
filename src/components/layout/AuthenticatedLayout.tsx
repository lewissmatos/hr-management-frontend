import { Outlet } from "react-router-dom";
import AppDrawer from "./AppDrawer";
const AuthenticatedLayout = () => {
	return (
		<section className="flex flex-row h-screen transition-all duration-100  flex-grow overflow-hidden">
			<div className="w-1/5 p-4">
				<AppDrawer />
			</div>
			<div className="w-4/5 p-2 overflow-x-hidden">
				<Outlet />
			</div>
		</section>
	);
};

export default AuthenticatedLayout;
