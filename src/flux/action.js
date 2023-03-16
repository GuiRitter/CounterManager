import * as type from './type';

// import { getLog } from '../util/log';

// const log = getLog('flux.action.index.');

// const doesNothing = ({
// 	type: type.NO_OP
// });

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

export const toggleTheme = () => ({
	type: type.TOGGLE_THEME
});
