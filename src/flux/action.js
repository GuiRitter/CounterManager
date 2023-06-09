import { bindActionCreators } from 'redux';
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

export const resetCounter = () => dispatch => {
	if (!window.confirm('Are you sure you want to reset all enabled counters?')) {
		return;
	}
	dispatch({
		type: type.RESET_COUNTER
	});
};

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

export const toggleTheme = () => ({
	type: type.TOGGLE_THEME
});

export const updateCounter = (name, operation, id) => dispatch => {
	const button = document.getElementById(id);
	button.classList.add('hidden');
	setTimeout(() => {
		button.classList.remove('hidden');
	}, 1000);
	dispatch({
		type: type.UPDATE_COUNTER,
		name,
		operation
	});
};
