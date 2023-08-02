import { LOCAL_STORAGE_NAME } from '../constant/system';

import { ColorTheme } from '../enum/colorTheme';
import { Operation } from '../enum/operation';

import { Counter } from '../model/counter';

import { byIsEnabled, byIsEnabledAndNameAsc, byNotThisName as byNotThisCounterName, getCounterByName } from '../util/counter';
import { byNotFirst as byNotFirstCounterLog, byDateTimeDesc as byCounterLogDateTimeDesc, getListAppendedAndSorted } from '../util/counterLog';
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
		projectList: currentState.projectList.map(mProject => {

			const counterNew: Counter = {
				name: action.name,
				count: 0,
				isEnabled: true
			};

			return getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
				counterList: mProject.counterList.concat(counterNew).sort(byIsEnabledAndNameAsc),
				logList: getListAppendedAndSorted(mProject.logList, counterNew, Operation.CREATE)
			}) : mProject
		})
	});
};

const createProject = (currentState: State, action: NameAction) => {

	if (currentState.projectList.find(getProjectByName(action.name))) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.concat({
			name: action.name,
			counterList: [],
			logList: []
		}).sort(byName)
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

	const counter = project.counterList.find(getCounterByName(action.name));

	if (!counter) {
		return currentState;
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: mProject.counterList.filter(byNotThisCounterName(action.name)),
			logList: getListAppendedAndSorted(mProject.logList, counter, Operation.DELETE)
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
			}) : mCounter).sort(byIsEnabledAndNameAsc),
			logList: getListAppendedAndSorted(mProject.logList, counter, action.isEnabled ? Operation.ENABLE : Operation.DISABLE)
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
			}) : mCounter).sort(byIsEnabledAndNameAsc),
			logList: mProject.counterList.filter(byIsEnabled).reduce(
				(previousLogList, currentCounter) => getListAppendedAndSorted(previousLogList, currentCounter, Operation.RESET, false),
				mProject.logList
			).sort(byCounterLogDateTimeDesc)
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

const undo = (currentState: State) => {

	if (!currentState.projectCurrent) {
		return currentState;
	}

	const project = currentState.projectList.find(getProjectByName(currentState.projectCurrent));

	if (!project) {
		return currentState;
	}

	if (project.logList.length < 1) {
		return currentState
	}

	const counterLog = project.logList[0];
	let counterList: Counter[];

	if (counterLog.operation === Operation.CREATE) {
		counterList = project.counterList.filter(byNotThisCounterName(counterLog.counter.name));
	} else if (counterLog.operation === Operation.DELETE) {
		counterList = project.counterList.concat(counterLog.counter);
	} else {
		counterList = project.counterList.map(mCounter => getCounterByName(counterLog.counter.name)(mCounter) ? counterLog.counter : mCounter);
	}

	return updateLocalStorage({
		...currentState,
		projectList: currentState.projectList.map(mProject => getProjectByName(currentState.projectCurrent)(mProject) ? Object.assign({}, mProject, {
			counterList: counterList.sort(byIsEnabledAndNameAsc),
			logList: project.logList.filter(byNotFirstCounterLog).sort(byCounterLogDateTimeDesc)
		}) : mProject)
	});
};

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
			}) : mCounter).sort(byIsEnabledAndNameAsc),
			logList: getListAppendedAndSorted(mProject.logList, counter, action.operation)
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

		case Type.UNDO:
			return undo(currentState);

		case Type.UPDATE_COUNTER:
			return updateCounter(currentState, action);

		default: return currentState;
	}
};

export default reducer;
