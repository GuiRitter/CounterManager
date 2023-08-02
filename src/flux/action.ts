import { Operation } from '../enum/operation';

import { AppDispatch } from '../store';

import { Action, EnableAction, NameAction, OperationAction } from './interface';
import { Type } from './type';

export const createCounter = () => (dispatch: AppDispatch) => {
	let name = (prompt('Enter a name for the new counter:') || '').trim();
	if (!name) {
		return;
	}
	dispatch({
		type: Type.CREATE_COUNTER,
		name
	} as NameAction);
};

export const createProject = () => (dispatch: AppDispatch) => {
	let name = (prompt('Enter a name for the new project:') || '').trim();
	if (!name) {
		return;
	}
	dispatch({
		type: Type.CREATE_PROJECT,
		name
	} as NameAction);
};

export const deleteCounter = (name: string) => (dispatch: AppDispatch) => {
	if (!window.confirm(`Delete counter ${name}?`)) {
		return;
	}
	dispatch({
		type: Type.DELETE_COUNTER,
		name
	} as NameAction);
};

export const deleteProject = (name: string) => (dispatch: AppDispatch) => {
	if (!window.confirm(`Delete project ${name}?`)) {
		return;
	}
	dispatch({
		type: Type.DELETE_PROJECT,
		name
	} as NameAction);
};

export const enableCounter = (name: string, isEnabled: boolean) => ({
	type: Type.ENABLE_COUNTER,
	name,
	isEnabled
} as EnableAction);

export const manageCounters = (name: string) => ({
	type: Type.MANAGE_COUNTER,
	name
} as NameAction);

export const manageProjects = () => ({
	type: Type.MANAGE_PROJECT
} as Action);

export const resetCounter = () => (dispatch: AppDispatch) => {
	if (!window.confirm('Are you sure you want to reset all enabled counters?')) {
		return;
	}
	dispatch({
		type: Type.RESET_COUNTER
	} as Action);
};

export const restoreFromLocalStorage = () => ({
	type: Type.RESTORE_FROM_LOCAL_STORAGE
} as Action);

export const toggleTheme = () => ({
	type: Type.TOGGLE_THEME
} as Action);

export const undo = () => (dispatch: AppDispatch) => {
	if (!window.confirm(`Confirm undo?`)) {
		return;
	}
	dispatch({
		type: Type.UNDO,
	} as Action);
};

export const updateCounter = (name: string, operation: Operation, id: string) => (dispatch: AppDispatch) => {
	const button = document.getElementById(id);
	if (!button) {
		return;
	}
	button.classList.add('hidden');
	setTimeout(() => {
		button.classList.remove('hidden');
	}, 1000);
	dispatch({
		type: Type.UPDATE_COUNTER,
		name,
		operation
	} as OperationAction);
};
