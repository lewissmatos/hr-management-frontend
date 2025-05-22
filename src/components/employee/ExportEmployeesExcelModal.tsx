import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
	ModalFooter,
	CircularProgress,
} from "@heroui/react";
import { useLsmTranslation } from "react-lsm";
import GenericDateQuery from "../common-filters/GenericDateQuery";
import { useGetEmployeesToExport } from "../../features/service-hooks/useEmployeeService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { Employee } from "../../types/app-types";
import { formatCurrency } from "../../utils/format.utils";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

type ColumnDef<T> = {
	label: string;
	value: keyof T | string | ((row: T) => any);
};

function getValueFromPath(obj: any, path: string): any {
	return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

const ExportEmployeesExcelModal = ({ isOpen, onClose }: Props) => {
	const { translate } = useLsmTranslation();
	const [filters, setFilters] = useState({
		startDate: new Date().toISOString(),
		endDate: new Date().toISOString(),
	});

	const { data, isFetching } = useGetEmployeesToExport({
		startDate: filters.startDate,
		endDate: filters.endDate,
	});

	const isButtonEnabled = Boolean(
		data?.data && filters.startDate && filters.endDate
	);

	const fileName = `employees_${format(
		new Date(filters.startDate),
		"dd-MM-yyyy"
	)}_${format(new Date(filters.endDate), "dd-MM-yyyy")}`;

	const columns: ColumnDef<Employee>[] = useMemo(() => {
		return [
			{ label: "Nombre", value: "name" },
			{ label: "Cédula", value: "cedula" },
			{ label: "Salario", value: (x) => formatCurrency(x.salary) },
			{ label: "Departamento", value: "department" },
			{ label: "Puesto", value: "jobPosition.name" },
			{
				label: "Riesgo del Puesto",
				value: (x) => x.jobPosition?.riskLevel,
			},
			{ label: "Empleado Activo", value: (x) => (x.isActive ? "Sí" : "No") },
		];
	}, []);
	function exportToExcel() {
		const transformedData = data?.data?.map((row) => {
			const result: Record<string, any> = {};
			columns.forEach((col) => {
				if (typeof col.value === "function") {
					result[col.label] = col.value(row);
				} else if (typeof col.value === "string" && col.value.includes(".")) {
					result[col.label] = getValueFromPath(row, col.value);
				} else {
					result[col.label] = (row as any)[col.value];
				}
			});
			return result;
		});

		const worksheet = XLSX.utils.json_to_sheet(transformedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		saveAs(blob, `${fileName}.xlsx`);
	}

	return (
		<Modal isOpen={isOpen} size="sm" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{translate("workExperienceModa.title")}
						</ModalHeader>
						<ModalBody className="flex flex-col gap-4 items-center ">
							<GenericDateQuery
								paramName="startDate"
								date={filters.startDate}
								setDebouncedDate={(date: string) => {
									setFilters((prev) => ({
										...prev,
										startDate: date,
									}));
								}}
								className="w-full"
							/>
							<GenericDateQuery
								paramName="endDate"
								date={filters.endDate}
								setDebouncedDate={(date: string) => {
									setFilters((prev) => ({
										...prev,
										endDate: date,
									}));
								}}
								className="w-full"
							/>
						</ModalBody>
						<ModalFooter
							className={`flex flex-row gap-2 ${
								isFetching ? "justify-between" : "justify-end"
							}`}
						>
							{isFetching ? (
								<CircularProgress size="sm" isIndeterminate />
							) : (
								<>
									{isButtonEnabled ? (
										<div className="flex justify-start w-full items-center">
											<p className="text-sm text-primary-500">{`${
												data?.data?.length
											} ${translate("element")}s`}</p>
										</div>
									) : null}
								</>
							)}
							<div className="flex flex-row gap-2">
								<Button color="danger" variant="light" onPress={onClose}>
									{translate("common.cancel")}
								</Button>
								<Button
									color="primary"
									isDisabled={!isButtonEnabled}
									onPress={exportToExcel}
								>
									{translate("common.downloadExcel")}
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ExportEmployeesExcelModal;
