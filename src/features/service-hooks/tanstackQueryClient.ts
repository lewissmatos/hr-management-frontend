import { QueryClient } from "@tanstack/query-core";
let qc: QueryClient | undefined;
const getQueryClient = () => {
	if (!qc)
		qc = new QueryClient({
			defaultOptions: {
				queries: { staleTime: 5000, refetchOnWindowFocus: false },
			},
		});

	return qc;
};

export default getQueryClient;
