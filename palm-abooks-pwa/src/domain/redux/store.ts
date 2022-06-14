import { configureStore } from "@reduxjs/toolkit"
export const store = configureStore({
	reducer: s => s ?? {},
	devTools: false,
})
