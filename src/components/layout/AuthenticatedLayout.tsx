import { Outlet } from "react-router-dom";
import AppDrawer from "./AppDrawer";
const AuthenticatedLayout = () => {
	return (
		<section className="flex flex-row h-screen transition-all duration-100  flex-grow overflow-auto">
			<div className="w-2/12 ">
				<AppDrawer />
			</div>
			<div className="w-10/12 p-4">
				<Outlet />
			</div>
		</section>
	);
};

export default AuthenticatedLayout;
