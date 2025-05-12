export interface ApiResponse<T> {
	data: T;
	message: string;
	status: number;
	meta: PaginationResult<T> | null;
}
export interface PaginationResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}
