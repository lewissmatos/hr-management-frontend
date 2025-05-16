import React, { useMemo } from "react";
import { MagicIconButton, MagicTable } from "../ui";
import { WorkExperience } from "../../types/app-types";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

type Props<T> = {
	data: T[];
	setWorkExperienceToEdit: (
		index: number,
		workExperience: WorkExperience
	) => void;
};
const WorkExperienceTable = <T,>({
	data,
	setWorkExperienceToEdit,
}: Props<T>) => {
	const columns = useMemo(
		() => [
			{
				element: "company",
				selector: (workExperience: WorkExperience) => (
					<span className="font-semibold text-md">
						{workExperience.company}
					</span>
				),
			},
			{
				element: "startDate",
				selector: (workExperience: WorkExperience) => (
					<span className="text-md">
						{!workExperience.startDate
							? ""
							: format(workExperience.startDate, "dd-MM-yyyy")}
					</span>
				),
			},
			{
				element: "endDate",
				selector: (workExperience: WorkExperience) => (
					<span className="text-md">
						{!workExperience.endDate
							? ""
							: format(workExperience.endDate, "dd-MM-yyyy")}
					</span>
				),
			},
			{
				element: "position",
				selector: (workExperience: WorkExperience) => (
					<span className="text-md">{workExperience.position}</span>
				),
			},
			{
				element: "common.actions",
				selector: (workExperience: WorkExperience, index: number) => (
					<MagicIconButton
						size="sm"
						variant="flat"
						onPress={() => setWorkExperienceToEdit(index, workExperience)}
					>
						<Pencil size={16} />
					</MagicIconButton>
				),
			},
		],
		[setWorkExperienceToEdit]
	);
	return (
		<MagicTable columns={columns as any} data={data} selectionMode="none" />
	);
};

export default WorkExperienceTable;
