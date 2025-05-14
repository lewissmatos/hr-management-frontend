import React, { useMemo } from "react";
import { useLsmTranslation } from "react-lsm";
import ScreenWrapper from "../ui/ScreenWrapper";
import { MagicIconButton, MagicTable } from "../ui";
import NoDataScreen from "../ui/NoDataScreen";
import { Candidate } from "../../types/app-types";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetCandidates } from "../../features/service-hooks/useCandidateService";
import { formatCurrency } from "../../utils/format.utils";

const CandidatesScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const { data, isFetching } = useGetCandidates();
	const list = data?.data;
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
					<span className=" text-md">{candidate.name}</span>
				),
			},
			{
				element: "position",
				selector: (candidate: Candidate) => (
					<span className=" text-md">{candidate.applyingJobPosition.name}</span>
				),
			},
			{
				element: "applicationDate",
				selector: (candidate: Candidate) => (
					<span className=" text-md">
						{format(candidate.createdAt, "dd-MM-yyyy")}
					</span>
				),
			},
			{
				element: "department",
				selector: (candidate: Candidate) => (
					<span className=" text-md">{candidate.department.toString()}</span>
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
					<span className=" text-md">{candidate.recommendedBy.name}</span>
				),
			},
			{
				element: "common.actions",
				selector: (candidate: Candidate) => (
					<div className="flex gap-2">
						<MagicIconButton
							size="sm"
							variant="flat"
							onPress={() => {
								navigate(`/candidate/${candidate.id}`);
							}}
						>
							<Pencil size={18} />
						</MagicIconButton>
					</div>
				),
			},
		],
		[navigate]
	);

	return (
		<ScreenWrapper title={translate("candidates")}>
			{list?.length ? (
				<MagicTable<Candidate>
					columns={columns as any}
					data={list as []}
					selectionMode="none"
					isStriped
				/>
			) : (
				<NoDataScreen isFetching={isFetching} elementName="candidate" />
			)}
		</ScreenWrapper>
	);
};

export default CandidatesScreen;
