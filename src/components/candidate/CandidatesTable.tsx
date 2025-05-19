import React, { useMemo } from "react";
import { useLsmTranslation } from "react-lsm";
import { Candidate } from "../../types/app-types";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatList } from "../../utils/format.utils";
import { format } from "date-fns";
import { MagicIconButton, MagicTable } from "../ui";
import { BriefcaseBusiness } from "lucide-react";
import { Tooltip } from "@heroui/react";

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
				element: "proficiencies",
				selector: (candidate: Candidate) => (
					<Tooltip
						content={formatList(
							candidate.proficiencies.map((p) => p.description),
							"conjunction"
						)}
						isDisabled={candidate.proficiencies?.length === 1}
						className="text-md max-w-[260px]"
					>
						<span className="text-md">{`${
							candidate.proficiencies?.[0]?.description
						} ${
							candidate.proficiencies?.length > 1
								? translate("common.andQuantityMore", {
										replace: {
											values: { quantity: candidate.proficiencies?.length - 1 },
										},
								  })
								: ""
						}`}</span>
					</Tooltip>
				),
				className: "min-w-[160px]",
			},
			{
				element: "languages",
				selector: (candidate: Candidate) => (
					<Tooltip
						content={formatList(
							candidate.spokenLanguages.map((l) => l.name),
							"conjunction"
						)}
						isDisabled={candidate.spokenLanguages?.length === 1}
						className="text-md max-w-[260px]"
					>
						<span className="text-md">{`${
							candidate.spokenLanguages?.[0]?.name
						} ${
							candidate.spokenLanguages?.length > 1
								? translate("common.andQuantityMore", {
										replace: {
											values: {
												quantity: candidate.spokenLanguages?.length - 1,
											},
										},
								  })
								: ""
						}`}</span>
					</Tooltip>
				),
				className: "min-w-[160px]",
			},
			{
				element: "trainings",
				selector: (candidate: Candidate) => (
					<Tooltip
						content={formatList(
							candidate.trainings.map((t) => t.name),
							"conjunction"
						)}
						isDisabled={candidate.trainings?.length === 1}
						className="text-md max-w-[260px]"
					>
						<span className="text-md">{`${candidate.trainings?.[0]?.name} ${
							candidate.trainings?.length > 1
								? translate("common.andQuantityMore", {
										replace: {
											values: { quantity: candidate.trainings?.length - 1 },
										},
								  })
								: ""
						}`}</span>
					</Tooltip>
				),
				className: "min-w-[160px]",
			},
			{
				element: "workExperiences",
				selector: (candidate: Candidate) => (
					<Tooltip
						content={formatList(
							candidate.workExperiences.map((w) => w.position),
							"conjunction"
						)}
						isDisabled={candidate.workExperiences?.length === 1}
						className="text-md max-w-[260px]"
					>
						<span className="text-md">{`${
							candidate.workExperiences?.[0]?.position
						} ${
							candidate.workExperiences?.length > 1
								? translate("common.andQuantityMore", {
										replace: {
											values: { quantity: candidate.trainings?.length - 1 },
										},
								  })
								: ""
						}`}</span>
					</Tooltip>
				),
				className: "min-w-[160px]",
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
					<span className="text-md">
						{candidate.isActive ? translate("active") : translate("inactive")}
					</span>
				),
			},
			{
				element: "isEmployee",
				selector: (candidate: Candidate) => (
					<span className="text-md">
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
