import React, { FC, ReactNode, useMemo } from "react";
import { DefaultErrorWallContext, ErrorWallContext, useOptionalErrorWallManager } from "tws-common/react/components/error-wall/context";
import { ErrorWallManager } from "tws-common/react/components/error-wall/manager";
import useStickySubscribable from "tws-common/react/hook/useStickySubscribable";


export * from "./context"
export * from "./manager"

/**
 * Component, which displays aggregated errors, until it's cleaned.
 * 
 * @deprecated use new suspense/error boundary/react-query instead
 */
export const ErrorWall = (props: {
	errorRenderer: FC<{
		errors: any[]
	}>
	context?: ErrorWallContext
	children?: ReactNode
	manager?: ErrorWallManager
}) => {
	const {
		errorRenderer: ErrorRenderer,
		children,
		manager: propsedManager,
	} = props

	const Context = props.context ?? DefaultErrorWallContext

	const parentManager = useOptionalErrorWallManager(Context)
	const manager = useMemo(
		() => propsedManager ?? new ErrorWallManager(parentManager),
		[parentManager, propsedManager],
	)

	const errors = useStickySubscribable(manager.errorsBus)

	return (
		<Context.Provider value={manager}>
			<ErrorRenderer errors={errors} />
			{children}
		</Context.Provider>
	)
}