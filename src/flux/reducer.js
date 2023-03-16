import * as type from './type';

import * as theme from '../constant/colorTheme';
import { LOCAL_STORAGE_NAME } from '../constant/system';

import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';

const log = getLog('flux.reducer.');

const initialState =
{
	colorTheme: theme.LIGHT,
	projectList: [
		{ name: 'alpha' },
		{ name: 'bravo' },
		{ name: 'charlie' },
		{ name: 'delta' },
		{ name: 'echo' },
		{ name: 'foxtrot' },
		{ name: 'golf' },
		{ name: 'hotel' },
		{ name: 'india' },
		{ name: 'juliett' },
		{ name: 'kilo' },
		{ name: 'lima' },
		{ name: 'mike' },
		{ name: 'november' },
		{ name: 'oscar' },
		{ name: 'papa' },
		{ name: 'quebec' },
		{ name: 'romeo' },
		{ name: 'sierra' },
		{ name: 'tango' },
		{ name: 'uniform' },
		{ name: 'victor' },
		{ name: 'whiskey' },
		{ name: 'x-ay' },
		{ name: 'yankee' },
		{ name: 'zulu' },
		{ name: 'one' },
		{ name: 'two' },
		{ name: 'three' },
		{ name: 'four' },
		{ name: 'five' },
		{ name: 'six' },
		{ name: 'seven' },
		{ name: 'eight' },
		{ name: 'nine' },
		{ name: 'zero' }
	]
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
