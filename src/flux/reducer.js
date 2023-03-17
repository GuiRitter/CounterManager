import * as type from './type';

import * as theme from '../constant/colorTheme';
import { LOCAL_STORAGE_NAME } from '../constant/system';

import { byIsEnabledAndName, byNotThisName as byNotThisCounterName, getCounterByName } from '../util/counter';
import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';
import { byName, byNotThisName as byNotThisProjectName, getProjectByName } from '../util/project';

const log = getLog('flux.reducer.');

const initialState =
{
	colorTheme: theme.LIGHT,
	projectList: [],
	projectCurrent: null
};

const reducer = (currentState = initialState, action) => {
	log('reducer', { currentState, action });

	switch (action.type) {

		case type.CREATE_COUNTER:

			const project = currentState.projectList.find(getProjectByName(action.projectName));

			if (!project) {
				return currentState;
			}

			if (project.counterList.find(getCounterByName(action.counterName))) {
				return currentState;
			}

			return updateLocalStorage({
				...currentState,
				projectList: currentState.projectList.map(project => getProjectByName(action.projectName)(project) ? Object.assign({}, project, {
					counterList: project.counterList.concat({ name: action.counterName, count: 0, isEnabled: true }).sort(byIsEnabledAndName)
				}) : project)
			});

		case type.CREATE_PROJECT:

			if (currentState.projectList.find(getProjectByName(action.name))) {
				return currentState;
			}

			return updateLocalStorage({
				...currentState,
				projectList: currentState.projectList.concat({ name: action.name, counterList: [] }).sort(byName)
			});

		case type.DELETE_PROJECT:

			return updateLocalStorage({
				...currentState,
				projectList: currentState.projectList.filter(byNotThisProjectName(action.name))
			});

		case type.MANAGE_COUNTER:

			return updateLocalStorage({
				...currentState,
				projectCurrent: action.name
			});

		case type.MANAGE_PROJECT:

			return updateLocalStorage({
				...currentState,
				projectCurrent: null
			});

		case type.RESTORE_FROM_LOCAL_STORAGE:
			return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || initialState;

		case type.TOGGLE_THEME:
			return updateLocalStorage({
				...currentState,
				colorTheme: (currentState.colorTheme === theme.DARK) ? theme.LIGHT : theme.DARK
			});

		default: return currentState;
	}
};

export default reducer;
