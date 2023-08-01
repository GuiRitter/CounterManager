import { Project } from "../model/project";

export const byName = (projectA: Project, projectB: Project) => projectA.name.localeCompare(projectB.name);

export const byNotThisName = (name: string) => (project: Project) => project && (project.name !== name);

export const getProjectByName = (name: string | null) => (project: Project) => project && (project.name === name);
