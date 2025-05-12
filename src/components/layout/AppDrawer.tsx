import { Button, Accordion, AccordionItem, Selection } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useLsmTranslation } from "react-lsm";
import useAuthStore from "../../features/store/auth-store";
import useSystemRouter, {
	ItemGrouper,
} from "../../router/hooks/useSystemRouter";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import ThemeToggler from "./ThemeToggler";

const NavigationItem = ({
	grouper,
	selectedItem,
	onSelectItem,
	selectedKeys,
	setSelectedKeys,
}: {
	grouper: ItemGrouper;
	selectedItem: { grouper: string; path: string };
	onSelectItem: (item: string, url: string) => void;
	selectedKeys: Selection;
	setSelectedKeys: (keys: Selection) => void;
}) => {
	const isOpen = selectedItem.grouper === grouper.label;

	return (
		<Accordion
			isCompact
			selectedKeys={selectedKeys}
			onSelectionChange={(keys) => {
				setSelectedKeys(keys);
			}}
		>
			<AccordionItem
				key={grouper.label}
				title={grouper.label}
				startContent={
					grouper.Icon ? (
						<grouper.Icon className={isOpen ? " text-primary" : ""} />
					) : null
				}
				onPress={() => {
					const firstSubPath = grouper.childrenPaths?.[0];
					onSelectItem(firstSubPath.label, firstSubPath.path);
				}}
				classNames={{
					title: isOpen ? "font-bold text-primary" : "",
				}}
			>
				<div className="flex flex-col gap-2">
					{grouper.childrenPaths?.map((subPath) => (
						<Button
							key={subPath.path}
							variant={selectedItem.path == subPath.path ? "flat" : "light"}
							className="w-full text-foreground text-left justify-start"
							color="primary"
							onPress={() => onSelectItem(subPath.label, subPath.path)}
						>
							{subPath.label}
						</Button>
					))}
				</div>
			</AccordionItem>
		</Accordion>
	);
};
const AppDrawer = () => {
	const { translate } = useLsmTranslation();
	const { logout } = useAuthStore();
	const { getNavigationItems } = useSystemRouter();
	const grouperItems = getNavigationItems();
	const navigate = useNavigate();
	const [selectedKeys, setSelectedKeys] = useState(
		new Set([grouperItems[0].label])
	);

	const path: string = location.pathname?.split("/")?.[1] ?? "";

	const selectedItem = useMemo(() => {
		const selectedItem = grouperItems
			.flatMap((item) => item.childrenPaths)
			.find((subItem) => {
				return subItem.path === path;
			})?.path;

		const grouper = grouperItems.find((item) =>
			item.childrenPaths?.some((subItem) => subItem.path === path)
		)?.label;
		return {
			grouper: grouper as string,
			path: selectedItem as string,
		};
	}, [path, grouperItems]);

	const onSelectItem = useCallback((item?: string, url?: string) => {
		if (!item || !url) return <></>;
		const path = url.split("/")?.[0];
		navigate(`/${path}`, { replace: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="shadow-lg shadow-foreground-300 h-screen flex flex-col justify-between gap-2 py-2 px-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between gap-1 ">
					<h4 className="text-xl font-semibold">{translate("APP_NAME")}</h4>
					<ThemeToggler />
				</div>
				<div className="flex flex-col gap-2">
					{grouperItems.map((grouper) => (
						<NavigationItem
							selectedKeys={selectedKeys}
							grouper={grouper}
							selectedItem={selectedItem}
							setSelectedKeys={setSelectedKeys as (keys: Selection) => void}
							onSelectItem={onSelectItem}
							key={grouper.label}
						/>
					))}
				</div>
			</div>
			<div className="flex justify-start">
				<Button
					color="danger"
					variant="light"
					className="w-full"
					endContent={<LogOut size="16" />}
					onPress={logout}
				>
					{translate("logout.button")}
				</Button>
			</div>
		</div>
	);
};
export default AppDrawer;
