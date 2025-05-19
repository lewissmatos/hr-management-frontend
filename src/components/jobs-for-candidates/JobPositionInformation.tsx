import React from "react";
import { JobPosition } from "../../types/app-types";
import { getJobPositionRiskLevelColorClass } from "../job-position/job-position.utils";
import { formatCurrency } from "../../utils/format.utils";
import { Textarea } from "@heroui/react";
import { CircleDollarSign, TriangleAlert } from "lucide-react";
import { useLsmTranslation } from "react-lsm";

type Props = {
	jobPosition: JobPosition;
};
const JobPositionInformation = ({ jobPosition }: Props) => {
	const { translate } = useLsmTranslation();
	const riskLevelColorClass = getJobPositionRiskLevelColorClass(
		jobPosition.riskLevel
	);
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row gap-2 items-center">
				<h2 className="text-2xl font-semibold">{jobPosition.name}</h2>
				{jobPosition.department ? (
					<h5 className="text-xl text-foreground-500">
						{`/ ${jobPosition.department}`}
					</h5>
				) : (
					""
				)}
			</div>

			<div
				className={"text-primary-500 text-xl flex flex-row gap-2 items-center"}
			>
				<CircleDollarSign size={24} />
				{`${formatCurrency(jobPosition.minSalary)} - ${formatCurrency(
					jobPosition.maxSalary
				)}`}
			</div>
			<div
				className={`text-${riskLevelColorClass}-500 text-lg flex flex-row gap-2 items-center`}
			>
				<TriangleAlert
					className={`text-${riskLevelColorClass}-500 `}
					size={20}
				/>
				{translate("riskLevelInfo", {
					replace: { values: { riskLevel: jobPosition.riskLevel } },
				})}
			</div>
			{jobPosition.description && (
				<Textarea
					value={jobPosition.description}
					isReadOnly
					variant="bordered"
					className="overflow-x-hidden overflow-y-auto min-h-[500px] text-lg hover:bg-transparent focus:border-none focus:outline-none"
					classNames={{
						input:
							"overflow-x-hidden overflow-y-auto min-h-[500px] text-lg hover:bg-transparent focus:border-none focus:outline-none",
					}}
				/>
			)}
		</div>
	);
};

export default JobPositionInformation;
