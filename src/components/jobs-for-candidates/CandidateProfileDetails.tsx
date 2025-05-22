import React, { FC } from "react";
import { useForm } from "react-hook-form";
import {
	Candidate,
	JobPosition,
	Language,
	Proficiency,
	Training,
	WorkExperience,
} from "../../types/app-types";
import { MagicInput } from "../ui";
import {
	BriefcaseBusiness,
	CircleDollarSign,
	PlusCircle,
	Save,
} from "lucide-react";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";
import { useLsmTranslation } from "react-lsm";
import {
	Alert,
	Autocomplete,
	AutocompleteItem,
	Button,
	Divider,
	Form,
	Listbox,
	ListboxItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import {
	onGetCandidateByCedula,
	useAddCandidate,
	useCheckCandidatePassword,
	useUpdateCandidate,
} from "../../features/service-hooks/useCandidateService";
import { useGetLanguages } from "../../features/service-hooks/useLanguageService";
import useDebounce from "../../hooks/useDebounce";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import { useGetProficiencies } from "../../features/service-hooks/useProficiencyService";
import { useGetTrainings } from "../../features/service-hooks/useTrainingService";
import { useGetEmployees } from "../../features/service-hooks/useEmployeeService";
import PasswordInput from "../ui/PasswordInput";
import WorkExperienceTable from "./WorkExperienceTable";
import WorkExperienceModal from "./WorkExperienceModal";
import { CandidateProfileConfirmationStatuses } from "./jobs-for-candidates.utils";
import toast from "react-hot-toast";

type Props = {
	isFromProfileDrawer?: boolean;
	onApplyJobPosition?: (candidateData: Candidate) => Promise<void>;
	applyingJobPosition?: JobPosition;
	isApplying?: boolean;
};
const CandidateProfileDetails: FC<Props> = ({
	isFromProfileDrawer,
	onApplyJobPosition,
	applyingJobPosition,
	isApplying,
}) => {
	const { translate } = useLsmTranslation();
	const { candidateData, hasCandidate, saveInfo } = useApplyingCandidateStore();

	const [
		candidateProfileConfirmationStatus,
		setCandidateProfileConfirmationStatus,
	] = React.useState<CandidateProfileConfirmationStatuses>(
		CandidateProfileConfirmationStatuses.NO_MATTER
	);
	const [debouncedLanguageSearch, setDebouncedLanguageSearch] = useDebounce();
	const { data: languagesData, isLoading: isFetchingLanguages } =
		useGetLanguages({
			name: debouncedLanguageSearch,
			isActive: [true],
		});

	const [debouncedProficienciesSearch, setDebouncedProficienciesSearch] =
		useDebounce();
	const { data: proficienciesData, isLoading: isFetchingProficiencies } =
		useGetProficiencies({
			description: debouncedProficienciesSearch,
			isActive: [true],
		});

	const [debouncedTrainingsSearch, setDebouncedTrainingsSearch] = useDebounce();
	const { data: trainingsData, isLoading: isFetchingTrainings } =
		useGetTrainings({
			name: debouncedTrainingsSearch,
			isActive: [true],
		});

	const { mutateAsync: onUpdateCandidate, isPending: isUpdatePending } =
		useUpdateCandidate();
	const { mutateAsync: onAddCandidate, isPending: isAddPending } =
		useAddCandidate();

	const { register, handleSubmit, setValue, watch, reset } = useForm<
		Partial<Candidate>
	>({
		defaultValues: candidateData
			? {
					...candidateData,
			  }
			: undefined,
	});

	const [
		debouncedRecommendedBySearch,
		setDebouncedRecommendedBySearch,
		recommendedBySearchInput,
	] = useDebounce(500, watch("recommendedBy.name") || "");

	const { data: employeesData, isLoading: isFetchingEmployees } =
		useGetEmployees({
			name: debouncedRecommendedBySearch,
			isActive: [true],
		});

	const {
		isOpen: isCandidatePasswordModalOpen,
		onClose: onCandidatePasswordModalClose,
		onOpen: onOpenCandidatePasswordModal,
	} = useDisclosure();

	const onSubmit = async (data: Partial<Candidate>) => {
		let candidate = {
			...data,
		};
		if (hasCandidate) {
			const info = {
				...candidateData,
				...data,
			} as Candidate;
			const res = await onUpdateCandidate(info);
			candidate = {
				...candidate,
				...res.data?.data,
			};
		} else {
			const info = {
				...data,
				proficiencies: data.proficiencies,
				spokenLanguages: data.spokenLanguages,
				trainings: data.trainings,
				recommendedBy: data.recommendedBy,
			};
			const res = await onAddCandidate(info);
			candidate = {
				...candidate,
				...res.data?.data,
			};
		}
		saveInfo(candidate as Candidate);
	};

	const {
		isOpen: isWorkExperienceModalOpen,
		onClose: onCloseWorkExperienceModal,
		onOpen: onOpenWorkExperienceModal,
	} = useDisclosure();

	const workExperiences = watch("workExperiences") ?? [];

	const [workExperienceToEdit, setWorkExperienceToEdit] = React.useState<{
		index: number;
		experience: Partial<WorkExperience> | null;
	}>();
	const { mutateAsync: onCheckCandidatePassword } = useCheckCandidatePassword();
	return (
		<>
			{isWorkExperienceModalOpen && (
				<WorkExperienceModal
					isOpen={isWorkExperienceModalOpen}
					onClose={() => {
						onCloseWorkExperienceModal();
						setWorkExperienceToEdit(undefined);
					}}
					editingWorkExperience={
						workExperienceToEdit?.experience as WorkExperience
					}
					onAddWorkExperience={(data) => {
						if (workExperienceToEdit?.index !== undefined) {
							const updatedWorkExperiences = [...workExperiences];
							updatedWorkExperiences[workExperienceToEdit.index] =
								data as WorkExperience;
							setValue("workExperiences", updatedWorkExperiences as any);
						} else {
							setValue("workExperiences", [
								...(workExperiences ?? []),
								data,
							] as any);
						}
						onCloseWorkExperienceModal();
					}}
				/>
			)}
			{isCandidatePasswordModalOpen && (
				<LoadCandidateDataWithPasswordModal
					isOpen={isCandidatePasswordModalOpen}
					onClose={() => {
						setValue("password", "");
						onCandidatePasswordModalClose();
					}}
					onConfirm={async (password) => {
						const res = await onCheckCandidatePassword({
							cedula: watch("cedula") as string,
							password,
						});
						if (res.data) {
							saveInfo(res.data as Candidate);
							setCandidateProfileConfirmationStatus(
								CandidateProfileConfirmationStatuses.CONFIRMED
							);
							reset({
								...res.data,
							});
							// location.reload();
						} else {
							setCandidateProfileConfirmationStatus(
								CandidateProfileConfirmationStatuses.DENY
							);
						}
						onCandidatePasswordModalClose();
					}}
				/>
			)}
			<div className="overflow-x-hidden overflow-y-auto">
				<Form
					className="flex flex-col gap-4 w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex  justify-between gap-4 w-full">
						<MagicInput
							{...register("cedula", { required: true, maxLength: 11 })}
							label={translate("cedula")}
							maxLength={11}
							type="text"
							defaultValue={candidateData?.cedula}
							value={watch("cedula")}
							isRequired
							isReadOnly={hasCandidate}
							onChange={async (e) => {
								setValue("cedula", e.target.value);
								if (e.target.value?.length === 11) {
									const res = await onGetCandidateByCedula(e.target.value);
									console.log("cedula check: ", res);
									if (res === "PENDING") {
										setCandidateProfileConfirmationStatus(
											CandidateProfileConfirmationStatuses.PENDING
										);
										onOpenCandidatePasswordModal();
									} else if (res === "NO_MATTER") {
										setCandidateProfileConfirmationStatus(
											CandidateProfileConfirmationStatuses.NO_MATTER
										);
									} else {
										toast.error(
											translate("jobPositionDetailsScreen.candidateIsEmployee")
										);
										setCandidateProfileConfirmationStatus(
											CandidateProfileConfirmationStatuses.DENY
										);
									}
								}
							}}
						/>
						<MagicInput
							{...register("name", { required: !hasCandidate, maxLength: 100 })}
							label={translate("name")}
							className="w-full"
							maxLength={100}
							type="text"
							isDisabled={
								candidateProfileConfirmationStatus ===
								CandidateProfileConfirmationStatuses.PENDING
							}
							defaultValue={candidateData?.name}
							isRequired
							value={watch("name")}
							onChange={(e) => {
								setValue("name", e.target.value);
							}}
						/>
					</div>
					{!hasCandidate &&
					candidateProfileConfirmationStatus !==
						CandidateProfileConfirmationStatuses.DENY ? (
						<div className={`flex justify-between w-full items-center gap-4`}>
							<PasswordInput
								{...(register("password", {
									required: !hasCandidate,
									minLength: 8,
								}) as any)}
								className="w-1/2"
								isRequired
							/>
						</div>
					) : undefined}
					{candidateData?.applyingJobPosition && (
						<div className="flex flex-row gap-4 w-full">
							<div className="flex flex-col gap-1">
								<span className="text-md font-semibold">
									{translate("applyingTo")}
								</span>
								<span className="text-md">
									{candidateData?.applyingJobPosition?.name}
								</span>
							</div>
							<Divider orientation="vertical" />
							<div className="flex flex-col gap-1">
								<span className="text-md font-semibold">
									{translate("department")}
								</span>
								<span className="text-md">
									{candidateData?.applyingJobPosition?.department}
								</span>
							</div>
						</div>
					)}
					{![
						CandidateProfileConfirmationStatuses.PENDING,
						CandidateProfileConfirmationStatuses.DENY,
					].includes(candidateProfileConfirmationStatus) ? (
						<>
							<Divider />
							<div className="w-full flex flex-row gap-4">
								<CustomListbox<Proficiency>
									data={proficienciesData?.data ?? []}
									defaultSelectedKeys={
										candidateData?.proficiencies?.map((x) => x.id) ?? []
									}
									isLoadingQuery={isFetchingProficiencies}
									setQuery={(value) => {
										setDebouncedProficienciesSearch(value);
									}}
									queryProperties={["description"]}
									candidate={candidateData as Candidate}
									setValues={(values) => {
										setValue("proficiencies", values);
									}}
									displayPropName="description"
									labelKey="proficiencies"
								/>
								<CustomListbox<Language>
									data={languagesData?.data ?? []}
									defaultSelectedKeys={
										candidateData?.spokenLanguages?.map((x) => x.id) ?? []
									}
									isLoadingQuery={isFetchingLanguages}
									setQuery={(value) => {
										setDebouncedLanguageSearch(value);
									}}
									queryProperties={["name"]}
									candidate={candidateData as Candidate}
									setValues={(values) => {
										setValue("spokenLanguages", values);
									}}
									displayPropName="name"
									labelKey="languages"
								/>

								<CustomListbox<Training>
									data={trainingsData?.data ?? []}
									defaultSelectedKeys={
										candidateData?.trainings?.map((x) => x.id) ?? []
									}
									isLoadingQuery={isFetchingTrainings}
									setQuery={(value) => {
										setDebouncedTrainingsSearch(value);
									}}
									queryProperties={["name"]}
									candidate={candidateData as Candidate}
									setValues={(values) => {
										setValue("trainings", values);
									}}
									displayCallback={(training) => {
										return `${training.name} (${training.institution})`;
									}}
									labelKey="trainings"
								/>
							</div>
							<div className="flex flex-row gap-4 w-full">
								<Autocomplete
									label={translate("recommendedBy")}
									className="w-full"
									onSelectionChange={(selectedKey) => {
										if (!selectedKey) return;
										const recommendedBy = employeesData?.data.find(
											(position) => position.id === Number(selectedKey)
										);
										if (recommendedBy) {
											setValue("recommendedBy", recommendedBy);
										}
									}}
									defaultSelectedKey={
										candidateData?.recommendedBy?.id || "no-recommended-by"
									}
									key={candidateData?.recommendedBy?.id || "no-recommended-by"}
									isLoading={isFetchingEmployees}
									inputValue={recommendedBySearchInput}
									onInputChange={(value) => {
										setDebouncedRecommendedBySearch(value);
									}}
								>
									{
										employeesData?.data.map((employee) => (
											<AutocompleteItem key={employee.id}>
												{employee.name}
											</AutocompleteItem>
										)) as any
									}
								</Autocomplete>
								<MagicInput
									{...register("minExpectedSalary", { required: true })}
									label={translate("minExpectedSalary")}
									className="w-full"
									type="number"
									defaultValue={candidateData?.minExpectedSalary?.toString()}
									startContent={
										<CircleDollarSign className="text-primary-500" size={18} />
									}
									isRequired
								/>
							</div>
							<div className="flex flex-col gap-2 w-full max-h-[300px]">
								<p className="font-semibold text-md">
									{translate("workExperience")}
								</p>
								{workExperiences?.length ? (
									<WorkExperienceTable
										data={workExperiences ?? []}
										setWorkExperienceToEdit={(index, experience) => {
											setWorkExperienceToEdit({
												index,
												experience,
											});
											onOpenWorkExperienceModal();
										}}
									/>
								) : (
									<></>
								)}
								<div className="flex justify-start">
									<Button
										variant="flat"
										endContent={<PlusCircle size={18} />}
										onPress={onOpenWorkExperienceModal}
									>
										{translate("addWorkExperience")}
									</Button>
								</div>
							</div>
						</>
					) : (
						<></>
					)}
					<div className="flex justify-end w-full">
						{isFromProfileDrawer && (
							<Button
								variant="solid"
								color="primary"
								type="submit"
								endContent={<Save size={18} />}
								isLoading={isAddPending || isUpdatePending}
								isDisabled={[
									CandidateProfileConfirmationStatuses.PENDING,
									CandidateProfileConfirmationStatuses.DENY,
								].includes(candidateProfileConfirmationStatus)}
							>
								{translate(
									isAddPending || isUpdatePending
										? "common.loading"
										: "common.save"
								)}
							</Button>
						)}
					</div>
				</Form>
				{applyingJobPosition?.id && onApplyJobPosition ? (
					<div className="flex justify-end w-full">
						{candidateData?.applyingJobPosition?.id ===
						applyingJobPosition.id ? (
							<Alert
								color="warning"
								title={translate("currentlyApplyingToThisPosition")}
							/>
						) : (
							<Button
								variant="solid"
								color="primary"
								size="lg"
								className="w-1/3 text-lg"
								onPress={async () => {
									const candidateInfo = {
										...watch(),
										...candidateData,
									} as Candidate;
									await onApplyJobPosition(candidateInfo);
								}}
								isLoading={isApplying}
								isDisabled={[
									CandidateProfileConfirmationStatuses.PENDING,
									CandidateProfileConfirmationStatuses.DENY,
								].includes(candidateProfileConfirmationStatus)}
								endContent={<BriefcaseBusiness size={20} />}
							>
								{translate(isApplying ? "common.loading" : "common.apply")}
							</Button>
						)}
					</div>
				) : (
					<> </>
				)}
			</div>
		</>
	);
};

type CustomListboxProps<T> = {
	data: T[];
	isLoading?: boolean;
	defaultSelectedKeys: number[];
	isLoadingQuery: boolean;
	setQuery: (query: string) => void;
	queryProperties: string[];
	candidate?: Candidate;
	setValues: (values: T[]) => void;
	displayPropName?: string;
	displayCallback?: (item: T) => string;
	labelKey: string;
};
const CustomListbox = <T,>({
	data,
	defaultSelectedKeys,
	isLoadingQuery,
	setQuery,
	queryProperties,
	setValues,
	displayPropName,
	displayCallback,
	labelKey,
}: CustomListboxProps<T & { id: number }>) => {
	const { translate } = useLsmTranslation();
	return (
		<div className="w-1/3 border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
			<Listbox
				topContent={
					<div className="flex flex-col gap-1">
						<span className="text-md font-semibold">{translate(labelKey)}</span>
						<GenericSearchByQueryInput
							properties={queryProperties}
							isLoading={isLoadingQuery}
							setQuery={setQuery}
							className="w-full"
							size="sm"
						/>
					</div>
				}
				onSelectionChange={(selectedKeys) => {
					const ids = [...selectedKeys].map((id) => Number(id));
					const selectedItems = data.filter((x) => ids.includes(x.id));
					setValues(selectedItems);
				}}
				selectionMode="multiple"
				key={`listbox-${labelKey}`}
				variant="flat"
				className="h-[300px] overflow-y-auto"
				defaultSelectedKeys={defaultSelectedKeys.map(String)} // <-- Add this line
			>
				{data.map((x) => (
					<ListboxItem
						title={displayPropName ? x[displayPropName] : displayCallback?.(x)}
						key={String(x.id)}
						classNames={{
							title: "text-sm",
						}}
					/>
				))}
			</Listbox>
		</div>
	);
};

type ConfirmApplyJobPositionDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (password: string) => Promise<void>;
};
const LoadCandidateDataWithPasswordModal = ({
	isOpen,
	onClose,
	onConfirm,
}: ConfirmApplyJobPositionDialogProps) => {
	const { translate } = useLsmTranslation();
	const [password, setPassword] = React.useState<string>("");
	return (
		<Modal isOpen={isOpen} size="md" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate(
								"jobPositionDetailsScreen.loadCandidateDataWithPasswordModal.title"
							)}
						</ModalHeader>
						<ModalBody>
							<p className="text-lg">
								{translate(
									"jobPositionDetailsScreen.loadCandidateDataWithPasswordModal.message"
								)}
							</p>
							<PasswordInput
								isRequired
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								className="w-full"
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								{translate("common.cancel")}
							</Button>
							<Button
								color="primary"
								onPress={async () => await onConfirm(password)}
								isDisabled={password?.length < 8}
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
export default CandidateProfileDetails;
