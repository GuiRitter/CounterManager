import * as type from './type';

import * as theme from '../constant/colorTheme';
import { LOCAL_STORAGE_NAME } from '../constant/system';

import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';

const log = getLog('flux.reducer.');

const initialState =
{
	colorTheme: theme.LIGHT
};

const reducer = (currentState = initialState, action) => {
	log('reducer', { currentState, action });

	switch (action.type) {

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
