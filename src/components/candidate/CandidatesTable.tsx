import React, { useMemo } from "react";
import { useLsmTranslation } from "react-lsm";
import { Candidate } from "../../types/app-types";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/format.utils";
import { format } from "date-fns";
import { MagicIconButton, MagicTable } from "../ui";
import { BriefcaseBusiness } from "lucide-react";

type Props = {
	data: Candidate[];
	setCandidateToMakeEmployee: (candidate: Candidate) => void;
	onOpenModalToMakeEmployee: () => void;
};
const CandidatesTable = ({
	data,
	setCandidateToMakeEmployee,
	onOpenModalToMakeEmployee,
}: Props) => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const columns = useMemo(
		() => [
			{
				element: "cedula",
				selector: (candidate: Candidate) => (
					<span className="font-semibold text-md">{candidate.cedula}</span>
				),
			},
			{
				element: "name",
				selector: (candidate: Candidate) => (
					<span className="text-md">{candidate.name}</span>
				),
				className: "min-w-[140px]",
			},
			{
				element: "candidateScreen.applyingJobPosition",
				selector: (candidate: Candidate) => (
					<span
						className="text-md font-semibold hover:underline cursor-pointer"
						onClick={() => {
							navigate(`/job-position/${candidate.applyingJobPosition.id}`);
						}}
					>
						{candidate.applyingJobPosition.name}
					</span>
				),
			},

			{
				element: "department",
				selector: (candidate: Candidate) => (
					<span className=" text-md">
						{candidate?.applyingJobPosition?.department?.toString()}
					</span>
				),
				className: "min-w-[140px]",
			},
			{
				element: "applyingDate",
				selector: (candidate: Candidate) => (
					<span className=" text-md">
						{format(candidate.createdAt, "dd-MM-yyyy")}
					</span>
				),
			},
			{
				element: "minExpectedSalary",
				selector: (candidate: Candidate) => (
					<span className=" text-md">
						{formatCurrency(Number(candidate.minExpectedSalary))}
					</span>
				),
			},
			{
				element: "recommendedBy",
				selector: (candidate: Candidate) => (
					<span
						className="text-md font-semibold hover:underline cursor-pointer"
						onClick={() => {
							navigate(`/employee/${candidate.recommendedBy.id}`);
						}}
					>
						{candidate.recommendedBy.name}
					</span>
				),
			},
			{
				element: "status",
				selector: (candidate: Candidate) => (
					<span className="text-md font-semibold hover:underline cursor-pointer">
						{candidate.isActive ? translate("active") : translate("inactive")}
					</span>
				),
			},
			{
				element: "isEmployee",
				selector: (candidate: Candidate) => (
					<span className="text-md font-semibold hover:underline cursor-pointer">
						{candidate.isEmployee
							? translate("common.yes")
							: translate("common.no")}
					</span>
				),
			},
			{
				element: "common.actions",
				selector: (candidate: Candidate) => (
					<div className="flex gap-2">
						<MagicIconButton
							tooltipProps={{
								content: translate("candidateScreen.makeEmployee"),
							}}
							color="primary"
							variant="solid"
							size="sm"
							isDisabled={candidate.isEmployee}
							onPress={() => {
								setCandidateToMakeEmployee(candidate);
								onOpenModalToMakeEmployee();
							}}
						>
							<BriefcaseBusiness size={18} />
						</MagicIconButton>
					</div>
				),
			},
		],
		[navigate]
	);
	return (
		<MagicTable<Candidate>
			columns={columns as any}
			data={data}
			selectionMode="none"
			isStriped
		/>
	);
};

export default CandidatesTable;
