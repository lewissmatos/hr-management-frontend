import React, { useState } from "react";
import ScreenWrapper from "../ui/ScreenWrapper";
import { useLsmTranslation } from "react-lsm";
import NoDataScreen from "../ui/NoDataScreen";
import { useGetJobPositions } from "../../features/service-hooks/useJobPositionService";
import JobPositionCard from "./JobPositionCard";
import GenericSearchByQueryInput from "../common-filters/GenericSearchByQueryInput";
import { CircleDollarSign, PlusCircle } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import GenericBooleanQueryHandler from "../common-filters/GenericBooleanQueryHandler";
import { Button, SelectItem } from "@heroui/react";
import { MagicSelect } from "../ui";
import { JobPositionRiskLevels } from "../../types/app-types";
import { useNavigate } from "react-router-dom";

const JobPositionsScreen = () => {
	const { translate } = useLsmTranslation();
	const navigate = useNavigate();
	const [debouncedNameInput, setSNameInput] = useDebounce();
	const [debouncedMinSalaryInput, setMinSalaryInput] = useDebounce();
	const [debouncedMaxSalaryInput, setMaxSalaryInput] = useDebounce();
	const [availabilityQuery, setAvailabilityQuery] = useState([true, false]);
	const [riskLevelsQuery, setRiskLevelsQuery] = useState([
		JobPositionRiskLevels.LOW,
		JobPositionRiskLevels.MEDIUM,
		JobPositionRiskLevels.HIGH,
	]);

	const { data, isFetching, refetch } = useGetJobPositions({
		name: debouncedNameInput,
		minSalary: debouncedMinSalaryInput,
		maxSalary: debouncedMaxSalaryInput,
		isAvailable: availabilityQuery,
		riskLevels: riskLevelsQuery,
	});
	const list = data?.data;
	return (
		<ScreenWrapper
			title={translate("jobPositions")}
			headerOptions={
				<Button
					variant="solid"
					color="primary"
					onPress={() => navigate("/job-position")}
					endContent={<PlusCircle />}
				>
					{translate("common.add")}
				</Button>
			}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-4">
					<GenericSearchByQueryInput
						properties={["name"]}
						isLoading={isFetching}
						setQuery={(name) => {
							setSNameInput(name);
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
					<GenericBooleanQueryHandler
						label={translate("availability")}
						setQuery={(values) => {
							setAvailabilityQuery(values);
						}}
						overrideOptions={[
							{ label: "available", value: "1" },
							{ label: "unavailable", value: "0" },
						]}
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
				{list?.length ? (
					<div className="flex flex-wrap gap-4 overflow-y-auto py-4 px-2">
						{list.map((position) => (
							<JobPositionCard
								key={position.id}
								position={position}
								refetch={refetch as any}
							/>
						))}
					</div>
				) : (
					<NoDataScreen
						isFetching={isFetching}
						elementName="jobPosition"
						linkLabel="/job-position"
					/>
				)}
			</div>
		</ScreenWrapper>
	);
};

export default JobPositionsScreen;
