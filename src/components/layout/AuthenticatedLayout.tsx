import { Outlet } from "react-router-dom";
import AppDrawer from "./AppDrawer";

const AuthenticatedLayout = () => {
	return (
		<section className="flex flex-col h-screen">
			<div className="transition-all duration-100 flex-grow overflow-auto">
				<AppDrawer />
				<Outlet />
			</div>
		</section>
	);
};

export default AuthenticatedLayout;
