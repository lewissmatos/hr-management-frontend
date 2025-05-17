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
	BriefcaseBusiness,
	CalendarDays,
	CircleDollarSign,
	TriangleAlert,
} from "lucide-react";
import { JobPosition } from "../../types/app-types";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";
import { useNavigate } from "react-router-dom";
import { getJobPositionRiskLevelColorClass } from "../job-position/job-position.utils";
import { MagicIconButton } from "../ui";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";
type Props = {
	position: JobPosition;
};
const JobPositionForCandidateCard: FC<Props> = ({ position }) => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const riskLevelColorClass = getJobPositionRiskLevelColorClass(
		position.riskLevel
	);

	const { candidateData } = useApplyingCandidateStore();

	const isCurrentlyApplying =
		candidateData?.applyingJobPosition?.id === position.id;

	const handleClickOnApply = () => {
		navigate(`/jobs-for-candidates/apply/${position.id}`);
	};
	return (
		<Card className="min-w-[360px]" shadow="sm">
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
			<CardFooter className="flex flex-row gap-2 justify-between items-center">
				<div className="text-sm text-foreground-500 flex flex-row gap-2">
					<CalendarDays size={18} />
					{translate("postedAt", {
						replace: {
							values: { date: format(position.createdAt, "dd-MM-yyyy") },
						},
					})}
				</div>
				<div className="flex flex-row gap-2">
					<MagicIconButton
						variant="solid"
						color="primary"
						size="sm"
						onPress={handleClickOnApply}
						disabled={!position.isAvailable}
						tooltipProps={{
							content: (
								<div className="text-sm flex flex-col gap-1">
									{isCurrentlyApplying ? (
										<span className="font-semibold">
											{translate("currentlyApplyingToThisPosition")}.
										</span>
									) : null}
									<span>{translate("common.seeMoreInfo")}</span>
								</div>
							),
						}}
					>
						<BriefcaseBusiness size={18} />{" "}
					</MagicIconButton>
				</div>
			</CardFooter>
		</Card>
	);
};

export default JobPositionForCandidateCard;
