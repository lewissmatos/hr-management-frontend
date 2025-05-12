interface GlobalModel {
	id: number;
	isActive: boolean;
	createdAt: string;
}
type User = {
	username: string;
	password: string;
} & GlobalModel;

type Proficiency = {
	description: string;
} & GlobalModel;

type Language = {
	name: string;
} & GlobalModel;
export type { User, Proficiency, Language };
