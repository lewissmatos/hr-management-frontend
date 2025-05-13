import { JobPositionRiskLevels } from "../../types/app-types";

const getJobPositionRiskLevelColorClass = (
	riskLevel: JobPositionRiskLevels
): string => {
	const riskLevelColors: Record<JobPositionRiskLevels, string> = {
		[JobPositionRiskLevels.LOW]: "success", // Green
		[JobPositionRiskLevels.MEDIUM]: "warning", // Orange
		[JobPositionRiskLevels.HIGH]: "danger", // Red
	};

	return riskLevelColors[riskLevel] || "foreground";
};

export { getJobPositionRiskLevelColorClass };
