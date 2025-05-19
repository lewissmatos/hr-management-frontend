import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import JobPositionForCandidateCard from "./JobPositionForCandidateCard";
import NoDataScreen from "../ui/NoDataScreen";
import { Avatar, Button, SelectItem, useDisclosure } from "@heroui/react";
import { CircleDollarSign, CircleUserRound } from "lucide-react";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import { MagicSelect } from "../ui";
import { JobPositionRiskLevels } from "../../types/app-types";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import useApplyingCandidateStore from "../../features/store/applying-candidate-store";

const JobsForCandidatesScreen = () => {
	const { translate } = useLsmTranslation();
	const [debouncedNameInput, setNameInput] = useDebounce();
	const [debouncedMinSalaryInput, setMinSalaryInput] = useDebounce();
	const [debouncedMaxSalaryInput, setMaxSalaryInput] = useDebounce();
	const [riskLevelsQuery, setRiskLevelsQuery] = useState([
		JobPositionRiskLevels.LOW,
		JobPositionRiskLevels.MEDIUM,
		JobPositionRiskLevels.HIGH,
	]);
	const { hasCandidate, candidateData } = useApplyingCandidateStore();

	const { data, isFetching } = useGetJobPositions({
		isAvailable: true,
		name: debouncedNameInput,
		minSalary: debouncedMinSalaryInput,
		maxSalary: debouncedMaxSalaryInput,
		riskLevels: riskLevelsQuery,
	});
	const jobPositions = data?.data;
	const {
		isOpen: isProfileDrawerOpen,
		onOpen: onOpenProfileDrawer,
		onClose: onCloseProfileDrawer,
	} = useDisclosure();
	return (
		<>
			<CandidateProfileDrawer
				isOpen={isProfileDrawerOpen}
				onClose={onCloseProfileDrawer}
			/>
			<ScreenWrapper
				title={translate("jobsForCandidatesScreen.title")}
				headerOptions={
					<Button
						variant="flat"
						onPress={onOpenProfileDrawer}
						startContent={
							<Avatar
								size="sm"
								icon={<CircleUserRound className="text-primary-500" />}
							/>
						}
					>
						{hasCandidate
							? candidateData?.name
							: translate("jobsForCandidatesScreen.createProfile")}
					</Button>
				}
				className="p-4"
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row gap-4">
						<GenericSearchByQueryInput
							properties={["name"]}
							isLoading={isFetching}
							setQuery={(name) => {
								setNameInput(name);
							}}
						/>
						<GenericSearchByQueryInput
							properties={["salary"]}
							isLoading={isFetching}
							inputType="number"
							className="w-1/6"
							startContent={
								<CircleDollarSign className="text-primary-500" size={18} />
							}
							setQuery={(query) => {
								setMinSalaryInput(query);
							}}
							overrideLabel={translate("startSalary")}
						/>
						<GenericSearchByQueryInput
							properties={["salary"]}
							isLoading={isFetching}
							inputType="number"
							className="w-1/6"
							startContent={
								<CircleDollarSign className="text-primary-500" size={18} />
							}
							setQuery={(query) => {
								setMaxSalaryInput(query);
							}}
							overrideLabel={translate("endSalary")}
						/>
						<MagicSelect
							label={translate("riskLevel")}
							className="w-1/5"
							selectionMode="multiple"
							onSelectionChange={(selectedKeys) => {
								if (!selectedKeys) return;
								setRiskLevelsQuery([...selectedKeys] as any);
							}}
							defaultSelectedKeys={riskLevelsQuery}
						>
							{Object.values(JobPositionRiskLevels).map((level) => (
								<SelectItem key={level}>{level}</SelectItem>
							))}
						</MagicSelect>
					</div>
					{jobPositions?.length ? (
						<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
							{jobPositions.map((jobPosition) => (
								<JobPositionForCandidateCard
									key={jobPosition.id}
									position={jobPosition}
								/>
							))}
						</div>
					) : (
						<NoDataScreen isFetching={isFetching} />
					)}
				</div>
			</ScreenWrapper>
		</>
	);
};

export default JobsForCandidatesScreen;
