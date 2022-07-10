import React, { ReactNode } from "react"
import {
	DefaultDialogContext,
	useProvideDialogManager,
} from "tws-common/ui/dialog"

/**
 * Displays dialog before children components, if one was set.
 *
 * Internally uses useProvideDialogManager.
 */
export const DialogBoundary = (props: { children?: ReactNode }) => {
	const [dm, render] = useProvideDialogManager()

	return (
		<>
			<DefaultDialogContext.Provider value={dm}>
				{render ? render() : null}
				{props.children}
			</DefaultDialogContext.Provider>
		</>
	)
}
