export const byName = (projectA, projectB) => projectA.name.localeCompare(projectB.name);

export const getProjectByName = name => project => project && (project.name === name);
