import * as type from './type';

// import { getLog } from '../util/log';

// const log = getLog('flux.action.index.');

const doesNothing = ({
	type: type.NO_OP
});

export const createCounter = () => dispatch => {
	let name = (prompt('Enter a name for the new counter:') || '').trim();
	if (!name) {
		return doesNothing;
	}
	dispatch({
		type: type.CREATE_COUNTER,
		name
	});
};

export const createProject = () => dispatch => {
	let name = (prompt('Enter a name for the new project:') || '').trim();
	if (!name) {
		return doesNothing;
	}
	dispatch({
		type: type.CREATE_PROJECT,
		name
	});
};

export const deleteCounter = name => dispatch => {
	if (!window.confirm(`Delete counter ${name}?`)) {
		return doesNothing;
	}
	dispatch({
		type: type.DELETE_COUNTER,
		name
	});
};

export const deleteProject = name => dispatch => {
	if (!window.confirm(`Delete project ${name}?`)) {
		return doesNothing;
	}
	dispatch({
		type: type.DELETE_PROJECT,
		name
	});
};

export const enableCounter = (name, isEnabled) => ({
	type: type.ENABLE_COUNTER,
	name,
	isEnabled
});

export const manageCounters = name => ({
	type: type.MANAGE_COUNTER,
	name
});

export const manageProjects = () => ({
	type: type.MANAGE_PROJECT
});

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

export const toggleTheme = () => ({
	type: type.TOGGLE_THEME
});
