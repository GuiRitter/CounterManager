import * as type from './type';

import * as theme from '../constant/colorTheme';
import { LOCAL_STORAGE_NAME } from '../constant/system';

import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';
import { byName, byNotThisName, getProjectByName } from '../util/project';

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

		case type.ADD_PROJECT:

			if (currentState.projectList.find(getProjectByName(action.name))) {
				return currentState;
			}

			return updateLocalStorage({
				...currentState,
				projectList: currentState.projectList.concat({ name: action.name }).sort(byName)
			});

		case type.DELETE_PROJECT:

			return {
				...currentState,
				projectList: currentState.projectList.filter(byNotThisName(action.name))
			};

		case type.MANAGE_COUNTER:

			return {
				...currentState,
				projectCurrent: action.name
			};

		case type.MANAGE_PROJECT:

			return {
				...currentState,
				projectCurrent: null
			};

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
