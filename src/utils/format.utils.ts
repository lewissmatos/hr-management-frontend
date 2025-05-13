const formatCurrency = (value: number): string => {
	const formatter = new Intl.NumberFormat("es-DO", {
		style: "currency",
		currency: "DOP",
	});
	return formatter.format(value);
};

export { formatCurrency };
