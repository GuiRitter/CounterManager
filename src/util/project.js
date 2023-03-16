export const byName = (projectA, projectB) => projectA.name.localeCompare(projectB.name);

export const byNotThisName = name => project => project && (project.name !== name);

export const getProjectByName = name => project => project && (project.name === name);
