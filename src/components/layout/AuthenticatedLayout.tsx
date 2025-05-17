import { Outlet } from "react-router-dom";
import AppDrawer from "./AppDrawer";
const AuthenticatedLayout = () => {
	return (
		<section className="flex flex-row h-screen transition-all duration-100 flex-grow overflow-hidden">
			<div className="w-1/6 p-2">
				<AppDrawer />
			</div>
			<div className="w-5/6 p-2 overflow-x-hidden">
				<Outlet />
			</div>
		</section>
	);
};

export default AuthenticatedLayout;
