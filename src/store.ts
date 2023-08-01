import { configureStore } from '@reduxjs/toolkit';

import reducer from './flux/reducer';

export const store = configureStore({
	reducer: { reducer },
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: {
			// ignoredActionPaths: [],
			// ignoredActions: [ENABLE_ABORT_REQUEST],
			// ignoredPaths: ['reducer.abortMethod'],
		}
	})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
