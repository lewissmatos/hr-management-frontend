import {
	Button,
	Accordion,
	AccordionItem,
	Selection,
	Divider,
} from "@heroui/react";
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
					{grouper.childrenPaths
						?.filter((sP) => !sP.hideFromDrawer)
						.map((subPath) => (
							<Button
								key={subPath.path}
								variant={selectedItem.path == subPath.path ? "flat" : "light"}
								className={`w-full ${
									selectedItem.path == subPath.path
										? "text-primary-500"
										: "text-default-500"
								} text-md text-left justify-between`}
								color="primary"
								onPress={() => onSelectItem(subPath.label, subPath.path)}
								endContent={
									subPath.Icon ? (
										<subPath.Icon
											className={
												selectedItem.path == subPath.path ? "text-primary" : ""
											}
										/>
									) : null
								}
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

	const path: string = location.pathname?.split("/")?.[1] ?? "";

	const selectedItem = useMemo(() => {
		const selectedItem = grouperItems
			.flatMap((item) => item.childrenPaths)
			.find((subItem) => {
				const cleanPath = subItem.path.split("/")[0];

				return cleanPath === path;
			})?.path;

		const grouper = grouperItems.find((item) =>
			item.childrenPaths?.some((subItem) => subItem.path.split("/")[0] === path)
		)?.label;

		return {
			grouper: grouper as string,
			path: selectedItem as string,
		};
	}, [path, grouperItems]);
	const [selectedKeys, setSelectedKeys] = useState(
		selectedItem.grouper
			? new Set([selectedItem.grouper])
			: new Set([grouperItems[0].label])
	);

	const onSelectItem = useCallback((item?: string, url?: string) => {
		if (!item || !url) return <></>;
		const path = url.split("/")[0];

		navigate(`/${path}`, { replace: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="shadow-xl shadow-foreground-300 inset-shadow-sm flex flex-col h-full justify-between gap-2 py-2 px-4 rounded-lg bg-background-200">
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between gap-1 ">
					<h4 className="text-xl font-semibold">{translate("APP_NAME")}</h4>
					<ThemeToggler />
				</div>
				<div className="flex flex-col gap-2">
					{grouperItems.map((grouper) => (
						<>
							<NavigationItem
								selectedKeys={selectedKeys}
								grouper={grouper}
								selectedItem={selectedItem}
								setSelectedKeys={setSelectedKeys as (keys: Selection) => void}
								onSelectItem={onSelectItem}
								key={grouper.label}
							/>
							{grouper.showDivider && <Divider />}
						</>
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
