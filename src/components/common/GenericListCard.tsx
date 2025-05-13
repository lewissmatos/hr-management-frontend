import { Card, CardFooter, CardHeader, Divider } from "@heroui/react";
import React, { FC } from "react";
import { MagicIconButton, MagicInput } from "../ui";
import { useLsmTranslation } from "react-lsm";
import { CalendarDays, CircleX, Pencil, Save } from "lucide-react";
import ToggleStatusButton from "./ToggleStatusButton";
import { format } from "date-fns";
type Props = {
	id: number;
	label: string;
	isActive: boolean;
	createdAt: string;
	useToggleStatus: () => {
		mutateAsync: (id: number) => Promise<void>;
		isPending: boolean;
	};
	refetch: () => Promise<void>;
	updateData?: {
		isPending: boolean;
		updateLabel: (id: number, newLabel: string) => Promise<void>;
	};
};
const GenericListCard: FC<Props> = ({
	id,
	label,
	isActive,
	createdAt,
	useToggleStatus,
	refetch,
	updateData,
}) => {
	const { translate } = useLsmTranslation();
	const [editData, setEditData] = React.useState<{
		isEditing: boolean;
		newDescription: string;
	}>({
		isEditing: false,
		newDescription: "",
	});

	const { mutateAsync: onToggleStatus, isPending: isToggleStatusPending } =
		useToggleStatus();

	return (
		<Card className="min-w-[300px]" shadow="sm">
			<CardHeader className="flex gap-3">
				<div className="flex gap-2 flex-row justify-between items-center w-full">
					{editData.isEditing ? (
						<MagicInput
							value={editData.newDescription}
							onChange={async (e) => {
								setEditData((prev) => ({
									...prev,
									newDescription: e.target.value,
								}));
							}}
							onKeyUp={async (e) => {
								if (e.key === "Enter") {
									await updateData?.updateLabel(id, editData.newDescription);
									setEditData((prev) => ({
										...prev,
										isEditing: !prev.isEditing,
									}));
								}
							}}
							classNames={{
								input: "text-md font-semibold p-0 gap-0",
							}}
							size="sm"
							className="w-full"
							autoFocus
							isDisabled={!isActive || updateData?.isPending}
						/>
					) : (
						<p
							className={`text-md font-semibold ${
								!isActive ? "text-foreground-500 opacity-60" : ""
							}`}
						>
							{label}
						</p>
					)}
					<MagicIconButton
						size="sm"
						variant="flat"
						isDisabled={!isActive}
						onPress={() => {
							if (!isActive) return;
							setEditData((prev) => ({
								...prev,
								isEditing: !prev.isEditing,
								newDescription: label,
							}));
						}}
						tooltipProps={{
							content: editData.isEditing
								? translate("common.cancel")
								: translate("common.edit"),
						}}
					>
						{editData.isEditing ? (
							<CircleX size={18} className="text-red-500" />
						) : (
							<Pencil size={18} />
						)}
					</MagicIconButton>
				</div>
			</CardHeader>
			<Divider />
			<CardFooter className="flex flex-row gap-2 justify-between items-center">
				<div className="text-sm text-foreground-500 flex flex-row gap-2">
					<CalendarDays size={18} />
					{format(createdAt, "dd-MM-yyyy")}
				</div>
				<div className="flex gap-2 items-center">
					<ToggleStatusButton
						isLoading={isToggleStatusPending}
						isActive={isActive}
						onPress={async () => {
							setEditData((prev) => ({
								...prev,
								isEditing: false,
							}));
							await onToggleStatus(id);
							await refetch();
						}}
					/>
					{editData.isEditing ? (
						<MagicIconButton
							size="sm"
							tooltipProps={{
								content: translate("common.save"),
							}}
							variant="flat"
							isDisabled={!isActive}
							isLoading={updateData?.isPending}
							onPress={async () => {
								if (!isActive) return;

								await updateData?.updateLabel(id, editData.newDescription);
								setEditData((prev) => ({
									...prev,
									isEditing: !prev.isEditing,
								}));
							}}
						>
							<Save size={18} />
						</MagicIconButton>
					) : null}
				</div>
			</CardFooter>
		</Card>
	);
};

export default GenericListCard;
