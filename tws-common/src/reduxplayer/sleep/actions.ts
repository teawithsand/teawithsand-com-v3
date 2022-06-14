import { createAction } from "@reduxjs/toolkit";
import { makeActionPrefix } from "tws-common/redux/action";


const prefix = makeActionPrefix(`player/sleep`)

export const onDeviceShook = createAction<void>(`${prefix}/onDeviceShook`)
export const onSleepTimedOut = createAction<void>(`${prefix}/onSleepTimedOut`)