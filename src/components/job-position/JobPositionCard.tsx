import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Tooltip,
} from "@heroui/react";
import React, { FC } from "react";
import { useLsmTranslation } from "react-lsm";
import {
	CalendarDays,
	CircleDollarSign,
	RefreshCcw,
	Ban,
	TriangleAlert,
	Pencil,
	Eye,
	CircleUserRound,
} from "lucide-react";
import { JobPosition } from "../../types/app-types";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";
import { getJobPositionRiskLevelColorClass } from "./job-position.utils";
import {
	useGetJobPositionCandidatesCount,
	useToggleJobPositionAvailability,
} from "../../features/service-hooks/useJobPositionService";
import { MagicIconButton } from "../ui";
import { useNavigate } from "react-router-dom";
type Props = {
	position: JobPosition;
	refetch: () => Promise<void>;
};
const JobPositionCard: FC<Props> = ({ position, refetch }) => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const {
		mutateAsync: onToggleAvailability,
		isPending: isToggleAvailabilityPending,
	} = useToggleJobPositionAvailability();

	const { data: candidatesCountData, isFetching: isFetchingCandidatesCount } =
		useGetJobPositionCandidatesCount(position.id);

	const riskLevelColorClass = getJobPositionRiskLevelColorClass(
		position.riskLevel
	);

	return (
		<Card className="min-w-[340px]" shadow="sm">
			<CardHeader className="flex gap-3">
				<div className="flex gap-2 flex-row justify-start items-center w-full">
					<Tooltip
						color={riskLevelColorClass as any}
						content={translate("riskLevelInfo", {
							replace: { values: { riskLevel: position.riskLevel } },
						})}
					>
						<Chip
							variant="bordered"
							color={riskLevelColorClass as unknown as any}
							size="sm"
							className="bg-transparent`"
							radius="sm"
						>
							<TriangleAlert
								className={`text-${riskLevelColorClass}-500 w-4 h-4`}
							/>
						</Chip>
					</Tooltip>
					<p
						className={`text-md font-semibold ${
							!position?.isAvailable ? "text-foreground-500 opacity-60" : ""
						}`}
					>
						{position?.name}
					</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				<div className="text-sm text-foreground-500 flex gap-2 items-center justify-start">
					<CircleDollarSign size={18} />
					{formatCurrency(Number(position.minSalary))} -{" "}
					{formatCurrency(Number(position.maxSalary))}
				</div>
			</CardBody>
			<Divider />
			<CardFooter className="flex flex-row gap-2 justify-between items-end">
				<div className="flex flex-col gap-1">
					<div className="text-sm text-foreground-500 flex flex-row gap-2">
						<CalendarDays size={18} />
						{format(position.createdAt, "dd-MM-yyyy")}
					</div>
					{isFetchingCandidatesCount ? (
						<div className="text-sm text-foreground-500 flex flex-row gap-2">
							...
						</div>
					) : (
						<div className="text-sm text-foreground-500 flex flex-row gap-2">
							<CircleUserRound size={18} />
							{translate("jobPositionCard.candidatesCount", {
								replace: {
									values: { count: candidatesCountData?.data ?? 0 },
								},
							})}
						</div>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<MagicIconButton
						size="sm"
						variant="flat"
						onPress={() => {
							navigate(`/job-position/details/${position.id}`);
						}}
						tooltipProps={{
							content: translate("common.seeMoreInfo"),
						}}
					>
						<Eye size={18} />
					</MagicIconButton>
					<MagicIconButton
						size="sm"
						variant="flat"
						onPress={() => {
							navigate(`/job-position/${position.id}`);
						}}
						tooltipProps={{
							content: translate("common.edit"),
						}}
					>
						<Pencil size={18} />
					</MagicIconButton>
					<MagicIconButton
						tooltipProps={{
							content: position.isAvailable
								? translate("common.markAsUnavailable")
								: translate("common.markAsAvailable"),
							color: position.isAvailable ? "danger" : "success",
						}}
						size="sm"
						variant="flat"
						onPress={async () => {
							await onToggleAvailability(position.id);
							await refetch();
						}}
						isDisabled={isToggleAvailabilityPending}
					>
						{position.isAvailable ? (
							<Ban size={18} className="text-red-500" />
						) : (
							<RefreshCcw size={18} className="text-green-500" />
						)}
					</MagicIconButton>
				</div>
			</CardFooter>
		</Card>
	);
};

export default JobPositionCard;
