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

export enum TrainingLevels {
	GRADO = "Grado",
	POSTGRADO = "Post-grado",
	MAESTRIA = "Maestría",
	DOCTORADO = "Doctorado",
	TECNICO = "Técnico",
	GESTION = "Gestión",
}

type Training = {
	name: string;
	level: TrainingLevels;
	startDate: string;
	endDate: string;
	institution: string;
} & GlobalModel;

export type { User, Proficiency, Language, Training };
