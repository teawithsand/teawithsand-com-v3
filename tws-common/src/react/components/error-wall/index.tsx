import React, { FC, ReactNode, useMemo, useState } from "react"
import { ErrorWallContext } from "tws-common/react/components/error-wall/context"
import { ErrorWallManager } from "tws-common/react/components/error-wall/manager"

export * from "./context"
export * from "./manager"

// TODO(teawithsand): add ability to pass some errors to upper level error wall

/**
 * Component, which displays aggregated errors, until it's cleaned.
 */
export const ErrorWall = (props: {
	errorRenderer: FC<{
		errors: any[]
	}>
	children?: ReactNode
}) => {
	const { errorRenderer: ErrorRenderer, children } = props

	const [errors, setErrors] = useState<any[]>([])

	const manager = useMemo(() => new ErrorWallManager(setErrors), [])

	return (
		<ErrorWallContext.Provider value={manager}>
			<ErrorRenderer errors={errors} />
			{children}
		</ErrorWallContext.Provider>
	)
}
