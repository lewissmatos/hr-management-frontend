import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Tooltip,
} from "@heroui/react";
import React from "react";
import { useLsmTranslation } from "react-lsm";
import { BriefcaseBusiness, CircleDollarSign } from "lucide-react";
import { Candidate } from "../../types/app-types";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";

type Props = {
	candidate: Candidate;
	onMakeEmployeeClick: (candidate: Candidate) => void;
};
const CandidateCard = ({ candidate, onMakeEmployeeClick }: Props) => {
	const { translate } = useLsmTranslation();
	return (
		<Card className="min-w-[360px] max-h-[300px]" shadow="sm">
			<div className="flex flex-row gap-4 justify-between">
				<div className="w-2/5 flex flex-col justify-between">
					<CardHeader className="flex gap-3">
						<div className="flex flex-col justify-center items-start w-full">
							<p className={`text-xl font-semibold `}>{candidate?.name}</p>
							<p className={`text-sm text-foreground-500 `}>
								{candidate?.cedula}
							</p>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="flex flex-col gap-2 justify-between">
						<div className="text-sm text-foreground-500 flex gap-2 items-end justify-start">
							<CircleDollarSign size={26} className="text-primary-500" />
							<span className="text-lg font-semibold text-primary-500">
								{formatCurrency(Number(candidate.minExpectedSalary))}
							</span>
						</div>
						<div className="text-sm text-foreground-500 flex gap-2 items-end justify-start">
							<BriefcaseBusiness size={26} className="text-primary-500" />
							<span className="text-lg font-semibold text-primary-500">
								{candidate.applyingJobPosition.name}
							</span>
						</div>
					</CardBody>
					<Divider />
					<CardFooter className="text-sm text-foreground-500 flex flex-col gap-1 items-start justify-between">
						<div className="flex flex-col gap-1 items-start justify-start ">
							<span className="text-md text-foreground-500">
								{format(candidate.createdAt, "dd-MM-yyyy")}
							</span>
							{candidate?.recommendedBy?.name ? (
								<Tooltip
									content={`${translate("recommendedBy")}: ${
										candidate?.recommendedBy?.name
									}`}
									placement="left-start"
								>
									<span className="text-md text-foreground-500">
										{`${translate("recommendedBy")}: ${
											candidate?.recommendedBy?.name
										}`}
									</span>
								</Tooltip>
							) : (
								<></>
							)}
						</div>

						<Button
							fullWidth
							variant="flat"
							size="sm"
							color="primary"
							onPress={() => onMakeEmployeeClick(candidate)}
							className="flex gap-2 items-center justify-center text-md"
						>
							{translate("candidateScreen.makeEmployee")}
						</Button>
					</CardFooter>
				</div>
				<div className="w-3/5 grid grid-cols-2 gap-3 p-3">
					<SectionWrapper
						title={translate("proficiencies")}
						elements={candidate.proficiencies}
						propName="description"
					/>
					<SectionWrapper
						title={translate("languages")}
						elements={candidate.spokenLanguages}
						propName="name"
					/>
					<SectionWrapper
						title={translate("trainings")}
						elements={candidate.trainings}
						propName="name"
					/>
					<SectionWrapper
						title={translate("proficiencies")}
						elements={candidate.workExperiences}
						propName="position"
					/>
				</div>
			</div>
		</Card>
	);
};

const SectionWrapper = <T,>({
	elements,
	title,
	propName,
}: {
	elements: T[];
	title: string;
	propName: string;
}) => {
	if (elements.length === 0) return <></>;
	return (
		<div className="overflow-x-hidden flex flex-col rounded-md bg-foreground-100 p-2">
			<p className="text-md font-semibold mb-1">{title}</p>
			<ul className="max-h-[100px] overflow-x-hidden overflow-y-visible">
				{elements?.map((x) => (
					<li key={x[propName]} className="text-md text-foreground-500">
						{`${x[propName]}.`}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CandidateCard;
