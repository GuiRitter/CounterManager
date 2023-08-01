import { LOCAL_STORAGE_NAME } from '../constant/system';

import { State } from '../flux/interface';

export const updateLocalStorage = (state: State) => {
	let savedState = Object.keys(state).filter(key => key !== 'data').reduce((object, key) => ({ ...object, [key]: (state as any)[key] }), {}) as State;
	localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedState));
	return state;
}
