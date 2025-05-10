import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
} from "@heroui/react";
import { LogOut } from "lucide-react";
import { useLsmTranslation } from "react-lsm";
import useAuthStore from "../../features/store/auth-store";
import useSystemRouter, { RouteItem } from "../../router/hooks/useSystemRouter";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";

const NavigationItem = ({
	item,
	isSelected,
	onSelectItem,
}: {
	item: RouteItem;
	isSelected?: boolean;
	onSelectItem: (item: string, url: string) => void;
}) => {
	return (
		<Button
			key={item.path}
			variant={isSelected ? "flat" : "light"}
			className="w-full text-foreground text-left justify-start"
			color="primary"
			startContent={item.Icon ? <item.Icon /> : null}
			onPress={() => onSelectItem(item.path, item.path)}
		>
			{item.label}
		</Button>
	);
};
const AppDrawer = () => {
	const { translate } = useLsmTranslation();
	const { getNavigationItems } = useSystemRouter();
	const navigationItems = getNavigationItems();
	const navigate = useNavigate();

	const path: string = location.pathname?.split("/")?.[1] ?? "";

	const selectedItem = useMemo(
		() =>
			navigationItems.find((item) => (item ? path.includes(item.path) : false)),
		[path, navigationItems]
	);

	const onSelectItem = useCallback((item?: string, url?: string) => {
		if (!item || !url) return <></>;
		const path = url.split("/")?.[0];
		navigate(`/${path}`, { replace: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const { logout } = useAuthStore();
	return (
		<Drawer
			isOpen
			placement="left"
			hideCloseButton
			className="w-2/12"
			radius="none"
			backdrop="transparent"
		>
			<DrawerContent>
				{() => (
					<>
						<DrawerHeader className="flex flex-col gap-1">
							Drawer Title
						</DrawerHeader>
						<DrawerBody>
							{navigationItems.map((item) => (
								<NavigationItem
									item={item}
									isSelected={selectedItem?.path === item.path}
									onSelectItem={onSelectItem}
									key={item.path}
								/>
							))}
						</DrawerBody>
						<DrawerFooter className="flex justify-start">
							<Button
								color="danger"
								variant="light"
								className="w-full"
								endContent={<LogOut size="16" />}
								onPress={logout}
							>
								{translate("logout.button")}
							</Button>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
};
export default AppDrawer;
