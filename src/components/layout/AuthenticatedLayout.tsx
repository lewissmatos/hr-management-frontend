import { Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
	return (
		<section className="flex flex-col h-screen">
			<div className="transition-all duration-100 flex-grow overflow-auto">
				<Outlet />
			</div>
		</section>
	);
};

export default AuthenticatedLayout;
