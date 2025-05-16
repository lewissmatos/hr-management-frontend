import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
	Form,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useLsmTranslation } from "react-lsm";
import { WorkExperience } from "../../types/app-types";
import { MagicDatePicker, MagicInput } from "../ui";
import { format, parseISO } from "date-fns";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onAddWorkExperience: (data: Partial<WorkExperience>) => void;
	editingWorkExperience?: WorkExperience;
};
const WorkExperienceModal = ({
	isOpen,
	onClose,
	onAddWorkExperience,
	editingWorkExperience,
}: Props) => {
	const { translate } = useLsmTranslation();
	const { register, handleSubmit, setValue } = useForm<WorkExperience>({
		defaultValues: editingWorkExperience
			? {
					...editingWorkExperience,
			  }
			: {},
	});
	const onSubmit = (data: WorkExperience) => {
		onAddWorkExperience(data);
	};
	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate("workExperienceModa.title")}
						</ModalHeader>
						<ModalBody>
							<Form onSubmit={handleSubmit(onSubmit)}>
								<MagicInput
									{...register("company", { required: true })}
									label={translate("company")}
									className="w-full"
									type="text"
									isRequired
									defaultValue={editingWorkExperience?.company}
								/>
								<MagicInput
									{...register("position", { required: true })}
									label={translate("position")}
									className="w-full"
									type="text"
									isRequired
									defaultValue={editingWorkExperience?.position}
								/>
								<MagicDatePicker
									label={translate("startDate")}
									className="w-full"
									onChange={(date) => {
										if (!date) return;
										setValue(
											"startDate",
											parseISO(date.toString()).toISOString()
										);
									}}
									isRequired
									defaultVal={
										editingWorkExperience?.startDate
											? format(editingWorkExperience?.startDate, "yyyy-MM-dd")
											: undefined
									}
								/>
								<MagicDatePicker
									label={translate("endDate")}
									className="w-full"
									onChange={(date) => {
										if (!date) return;
										setValue(
											"endDate",
											parseISO(date.toString()).toISOString()
										);
									}}
									defaultVal={
										editingWorkExperience?.endDate
											? format(editingWorkExperience?.endDate, "yyyy-MM-dd")
											: undefined
									}
								/>
								<div className="flex flex-row gap-2 mt-4 justify-between w-full">
									<Button color="danger" variant="light" onPress={onClose}>
										{translate("common.cancel")}
									</Button>
									<Button color="primary" type="submit">
										{translate("common.add")}
									</Button>
								</div>
							</Form>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default WorkExperienceModal;
