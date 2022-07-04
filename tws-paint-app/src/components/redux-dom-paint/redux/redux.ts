import { configureStore } from "@reduxjs/toolkit"

import { createPaintReducer } from "@app/components/redux-dom-paint/redux/paintActions"

// Please note that in general
//  creating multiple redux stores is anti-pattern
//  but in this case we have 100% separate app, which futhermore
//  may have(at least theoretically) multiple instance running
//  so using multiple stores should be ok here
//
//  Also note that paint is 100% isolated from rest of the app.
//  It will never use gallery redux or something like that.
//  Futhermore, state management for this component is complex enough(unlike gallery's)
//  to implement it as a separate store
//
// TODO(teawithsand): type hinting for this redux store
export const createPaintStore = () =>
	configureStore({
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				immutableCheck: false,
				serializableCheck: false,
			}),
		reducer: createPaintReducer(),
		devTools: false,
	})
