import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Tooltip,
} from "@heroui/react";
import { useLsmTranslation } from "react-lsm";
import { BriefcaseBusiness, CircleDollarSign, Eye } from "lucide-react";
import { Candidate } from "../../types/app-types";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/format.utils";
import { MagicIconButton } from "../ui";
import { useNavigate } from "react-router-dom";

type Props = {
	candidate: Candidate;
	onMakeEmployeeClick: (candidate: Candidate) => void;
};
const CandidateCard = ({ candidate, onMakeEmployeeClick }: Props) => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	return (
		<Card className="min-w-[360px] max-h-[300px]" shadow="sm">
			<div className="flex flex-row gap-4 justify-between">
				<div className="w-1/3 flex flex-col justify-between">
					<CardHeader className="flex gap-3">
						<div className="flex flex-col justify-center items-start w-full">
							<div className="flex gap-1 items-center justify-start w-full">
								<p className={`text-xl font-semibold `}>{candidate?.name}</p>
								<MagicIconButton
									size="sm"
									variant="light"
									onPress={() => {
										navigate(`/candidate/${candidate.id}`);
									}}
									tooltipProps={{
										content: translate("common.seeMoreInfo"),
									}}
								>
									<Eye size={18} />
								</MagicIconButton>
							</div>
							<p className={`text-sm text-foreground-500 `}>
								{candidate?.cedula}
							</p>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="flex flex-col gap-2 justify-between">
						<div className="text-sm text-foreground-500 flex gap-2 items-center justify-start">
							<CircleDollarSign size={26} className="text-primary-500" />
							<span className="text-lg font-semibold text-primary-500">
								{formatCurrency(Number(candidate.minExpectedSalary))}
							</span>
						</div>
						<div className="text-sm text-foreground-500 flex gap-2 items-end justify-start">
							<span className="text-md font-semibold text-primary-500">
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
							variant="solid"
							size="sm"
							color="primary"
							onPress={() => onMakeEmployeeClick(candidate)}
							endContent={<BriefcaseBusiness size={18} />}
						>
							{translate("candidateScreen.makeEmployee")}
						</Button>
					</CardFooter>
				</div>
				<div className="w-2/3 grid grid-cols-2 gap-3 p-3">
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
						propCallback={(x) => {
							return `${x.name} (${x.institution}) `;
						}}
					/>
					<SectionWrapper
						title={translate("workExperiences")}
						elements={candidate.workExperiences}
						propCallback={(x) => {
							return `${x.position} (${x.company}) `;
						}}
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
	propCallback,
}: {
	elements: T[];
	title: string;
	propName?: string;
	propCallback?: (x: T) => string;
}) => {
	if (elements.length === 0) return <></>;
	return (
		<div className="overflow-x-hidden flex flex-col rounded-md bg-foreground-100 p-2">
			<p className="text-md font-semibold mb-1">{title}</p>
			<ul className="max-h-[100px] overflow-x-hidden overflow-y-visible">
				{elements?.map((x) => (
					<li key={title} className="text-sm text-foreground-500">
						{propName ? `${x[propName]}.` : propCallback ? propCallback(x) : ""}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CandidateCard;
