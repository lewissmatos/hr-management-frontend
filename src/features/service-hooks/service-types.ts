export interface ApiResponse<T> {
	data: T;
	message: string;
	status: number;
	meta?: PaginationResult | null;
}
export interface PaginationResult {
	meta: {
		total: number;
		page: number;
		limit: number;
	};
}
