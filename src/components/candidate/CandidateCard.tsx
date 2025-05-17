import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import React from "react";
import { useLsmTranslation } from "react-lsm";
import {
	BriefcaseBusiness,
	CalendarDays,
	CircleDollarSign,
} from "lucide-react";
import { Candidate } from "../../types/app-types";
import { format } from "date-fns";
import { MagicIconButton } from "../ui";

type Props = {
	candidate: Candidate;
};
const CandidateCard = ({ candidate }: Props) => {
	const { translate } = useLsmTranslation();
	return (
		<Card className="min-w-[360px]" shadow="sm">
			<CardHeader className="flex gap-3">
				<div className="flex gap-2 flex-row justify-start items-center w-full">
					<p className={`text-md font-semibold `}>{candidate?.name}</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				<div className="text-sm text-foreground-500 flex gap-2 items-center justify-start">
					<CircleDollarSign size={18} />
				</div>
			</CardBody>
			<Divider />
			<CardFooter className="flex flex-row gap-2 justify-between items-center">
				<div className="text-sm text-foreground-500 flex flex-row gap-2">
					<CalendarDays size={18} />
					{translate("postedAt", {
						replace: {
							values: { date: format(candidate.createdAt, "dd-MM-yyyy") },
						},
					})}
				</div>
				<div className="flex flex-row gap-2">
					<MagicIconButton
						variant="solid"
						color="primary"
						size="sm"
						// tooltipProps={{}}
					>
						<BriefcaseBusiness size={18} />{" "}
					</MagicIconButton>
				</div>
			</CardFooter>
		</Card>
	);
};

export default CandidateCard;
