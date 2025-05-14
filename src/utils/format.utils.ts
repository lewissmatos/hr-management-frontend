const formatCurrency = (value: number): string => {
	const formatter = new Intl.NumberFormat("es-DO", {
		style: "currency",
		currency: "DOP",
	});
	return formatter.format(value);
};

const formatList = (vals: string[], type = "disjunction") => {
	return new Intl.ListFormat("es", {
		style: "long",
		type: type as "conjunction" | "disjunction",
	}).format(vals);
};

export { formatCurrency, formatList };
