import { LOCAL_STORAGE_NAME } from '../constant/system';

import { ColorTheme } from '../enum/colorTheme';
import { Operation } from '../enum/operation';

import { byIsEnabledAndName, byNotThisName as byNotThisCounterName, getCounterByName } from '../util/counter';
import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';
import { byName, byNotThisName as byNotThisProjectName, getProjectByName } from '../util/project';

import { NameAction, EnableAction, OperationAction, State } from './interface';
import { Type } from './type';

const log = getLog('flux.reducer.');

const initialState: State =
{
	colorTheme: ColorTheme.LIGHT,
	projectList: [],
	projectCurrent: null
};

const createCounter = (currentState: State, action: NameAction) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	if (project.counterList.find(getCounterByName(action.name))) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.concat({ name: action.name, count: 0, isEnabled: true }).sort(byIsEnabledAndName)
		}) : mProject)
	});
};

const createProject = (currentState: State, action: NameAction) => {

	if (currentState.projectList.find(getProjectByName(action.name))) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.concat({ name: action.name, counterList: [] }).sort(byName)
	});
};

const deleteCounter = (currentState: State, action: NameAction) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.filter(byNotThisCounterName(action.name))
		}) : mProject)
	});
};

const deleteProject = (currentState: State, action: NameAction) => updateLocalStorage({
	...currentState,
	projectList: currentState.projectList.filter(byNotThisProjectName(action.name))
});

const enableCounter = (currentState: State, action: EnableAction) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	const counter = project.counterList.find(getCounterByName(action.name));

	if (!counter) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.map(mCounter => getCounterByName(action.name)(mCounter) ? Object.assign({}, mCounter, {
				isEnabled: action.isEnabled
			}) : mCounter).sort(byIsEnabledAndName)
		}) : mProject)
	});
};

const manageCounter = (currentState: State, action: NameAction) => updateLocalStorage({
	...currentState,
	projectCurrent: action.name
});

const manageProject = (currentState: State) => updateLocalStorage({
	...currentState,
	projectCurrent: null
});

const resetCounter = (currentState: State) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.map(mCounter => mCounter.isEnabled ? Object.assign({}, mCounter, {
				count: 0
			}) : mCounter).sort(byIsEnabledAndName)
		}) : mProject)
	});
};

const restoreFromLocalStorage = () => {

	const storage = localStorage.getItem(LOCAL_STORAGE_NAME);

	return storage ? (JSON.parse(storage) as State) : initialState;
};

const toggleTheme = (currentState: State) => updateLocalStorage({
	...currentState,
	colorTheme: (currentState.colorTheme === ColorTheme.DARK) ? ColorTheme.LIGHT : ColorTheme.DARK
});

const updateCounter = (currentState: State, action: OperationAction) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	const counter = project.counterList.find(getCounterByName(action.name));

	if (!counter) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.map(mCounter => getCounterByName(action.name)(mCounter) ? Object.assign({}, mCounter, {
				count: (action.operation === Operation.INCREMENT) ? (mCounter.count + 1) : (mCounter.count - 1)
			}) : mCounter).sort(byIsEnabledAndName)
		}) : mProject)
	});
};

const reducer = (currentState = initialState, action: any) => {
	log('reducer', { currentState, action });

	switch (action.type) {

		case Type.CREATE_COUNTER:
			return createCounter(currentState, action);

		case Type.CREATE_PROJECT:
			return createProject(currentState, action);

		case Type.DELETE_COUNTER:
			return deleteCounter(currentState, action);

		case Type.DELETE_PROJECT:
			return deleteProject(currentState, action);

		case Type.ENABLE_COUNTER:
			return enableCounter(currentState, action);

		case Type.MANAGE_COUNTER:
			return manageCounter(currentState, action);

		case Type.MANAGE_PROJECT:
			return manageProject(currentState);

		case Type.RESET_COUNTER:
			return resetCounter(currentState);

		case Type.RESTORE_FROM_LOCAL_STORAGE:
			return restoreFromLocalStorage();

		case Type.TOGGLE_THEME:
			return toggleTheme(currentState);

		case Type.UPDATE_COUNTER:
			return updateCounter(currentState, action);

		default: return currentState;
	}
};

export default reducer;
