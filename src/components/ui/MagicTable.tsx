import React, { FC } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	TableColumnProps,
	TableProps,
	TableHeaderProps,
	TableBodyProps,
	Spinner,
} from "@heroui/react";
import { useLsmTranslation } from "react-lsm";

type TableColumnType = {
	// key is optional, if not provided, the whole row will be used as the key
	key?: string;
	element: string;
	selector: (
		value: string | number | object
	) => string | React.ReactNode | null;
	className?: string;
	props?: TableColumnProps<"th">;
	ignoreTranslation?: boolean;
	isHidden?: boolean;
};
type Props = {
	columns?: TableColumnType[];
	data?: any[];
	headerProps?: TableHeaderProps<"tr">;
	bodyProps?: TableBodyProps<"tr">;
	props?: TableProps;
	isLoading?: boolean;
};
const MagicTable: FC<TableProps & Props> = ({
	columns: _columns = [],
	data = [],
	headerProps,
	bodyProps,
	isLoading,
	...props
}) => {
	const columns = _columns.filter((column) => !column?.isHidden);
	const { translate } = useLsmTranslation();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center mt-8">
				<Spinner size="lg" />
			</div>
		);
	}
	return (
		<Table
			{...props}
			classNames={{ th: "text-sm" }}
			aria-label="table"
			data-testid="magic-table"
			selectionMode={
				props.selectionMode ?? (!data?.length ? "none" : "multiple")
			}
		>
			<TableHeader {...headerProps}>
				{columns.length ? (
					//Renders the columns in case they exist
					columns.map((column, index) => (
						<TableColumn
							key={column?.element ?? index}
							className={column.className}
							{...column.props}
							data-testid="table-column"
						>
							{typeof column.element === "string"
								? translate(column.element, {
										rejectDefaultFallback: column?.ignoreTranslation,
								  })
								: column.element}
						</TableColumn>
					))
				) : (
					<TableColumn
						key="empty"
						className="w-full"
						colSpan={columns.length}
						data-testid="no-columns-table-column"
					>
						{translate("magicTable.noColumns")}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody {...bodyProps}>
				{data?.length ? (
					//Renders the rows in case data exists
					data.map((row) => (
						<TableRow key={row?.externalId}>
							{columns.map((column) => (
								<TableCell key={column.key}>
									{column.selector(column.key ? row[column.key] : row)}
								</TableCell>
							))}
						</TableRow>
					))
				) : columns?.length ? (
					<TableRow>
						{Array.from({ length: columns.length }).map((_, i) => (
							<TableCell key={i + 1}>
								{translate("magicTable.noData")}
							</TableCell>
						))}
					</TableRow>
				) : (
					<TableRow>
						<TableCell data-testid="no-data-table-cell">
							{translate("magicTable.noData")}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default MagicTable;
