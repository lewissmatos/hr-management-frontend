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

export enum JobPositionRiskLevels {
	LOW = "Bajo",
	MEDIUM = "Medio",
	HIGH = "Alto",
}

type JobPosition = {
	name: string;
	riskLevel: JobPositionRiskLevels;
	minSalary: number;
	maxSalary: number;
	isAvailable: boolean;
} & GlobalModel;

type WorkExperience = {
	company: string;
	startDate: string;
	endDate: string;
	jobPosition: JobPosition;
} & GlobalModel;

export enum Departments {
	HR = "Recursos Humanos",
	IT = "Tecnologías de la Información",
	ADMINISTRATION = "Administración",
	SALES = "Ventas",
	PRODUCTION = "Producción",
}

type Employee = {
	cedula: string;
	name: string;
	startDate: string;
	jobPosition: JobPosition;
	department: Departments;
	salary: number;
	candidateBackground: Candidate;
} & GlobalModel;

type Candidate = {
	cedula: string;
	name: string;
	applyingJobPosition: JobPosition;
	department: Departments;
	minExpectedSalary: number;
	recommendedBy: Employee;
	proficiencies: Proficiency[];
	workExperiences: WorkExperience[];
	spokenLanguages: Language[];
	isActive: boolean;
	isEmployee: boolean;
} & GlobalModel;

export type {
	User,
	Proficiency,
	Language,
	Training,
	Candidate,
	JobPosition,
	WorkExperience,
	Employee,
};
