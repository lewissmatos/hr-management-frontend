import React from "react";
import { Candidate } from "../../types/app-types";
import { useLsmTranslation } from "react-lsm";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { MagicInput } from "../ui";
import { CircleDollarSign } from "lucide-react";
import { formatCurrency } from "../../utils/format.utils";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	candidate: Candidate;
	onConfirm: (salary?: number) => Promise<void>;
	isLoading: boolean;
};

const MakeCandidateEmployeeDialog = ({
	isOpen,
	onClose,
	candidate,
	onConfirm,
	isLoading,
}: Props) => {
	const { translate } = useLsmTranslation();
	const [salary, setSalary] = React.useState<number>(
		candidate?.minExpectedSalary || 0
	);
	const minSalary = candidate?.minExpectedSalary
		? Number(
				candidate.minExpectedSalary - Number(candidate.minExpectedSalary) * 0.05
		  )
		: 0;
	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate("candidateScreen.makeEmployeeModal.title", {
								replace: { values: { candidateName: candidate.name } },
							})}
						</ModalHeader>
						<ModalBody>
							<p className="text-lg">
								{translate("candidateScreen.makeEmployeeModal.message")}
							</p>
							<MagicInput
								label={translate("salary")}
								value={String(salary)}
								onChange={(e) => {
									const value = e.target.value;
									setSalary(Number(value));
								}}
								min={minSalary}
								type="number"
								className="mt-2"
								startContent={
									<CircleDollarSign className="text-primary-500" size={18} />
								}
							/>
							{minSalary ? (
								<small
									className={
										salary < minSalary ? "text-red-500" : "text-green-500"
									}
								>
									{translate(
										"candidateScreen.makeEmployeeModal.salaryWarning",
										{
											replace: {
												values: {
													minSalary: formatCurrency(minSalary),
												},
											},
										}
									)}
								</small>
							) : (
								<></>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
								isDisabled={isLoading}
							>
								{translate("common.cancel")}
							</Button>
							<Button
								color="primary"
								onPress={async () => await onConfirm(salary)}
								isDisabled={isLoading || salary < minSalary}
								isLoading={isLoading}
							>
								{translate("common.confirm")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default MakeCandidateEmployeeDialog;
