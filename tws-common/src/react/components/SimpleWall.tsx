import React from "react"
import { FC, ReactNode } from "react"

/**
 * Wall component, which show it's content, unless isFallback is set to true.
 * It's more useful than it looks.
 */
export const SimpleWall = (props: {
	isFallback: boolean
	fallback: FC<{}>
	children?: ReactNode
}) => {
	const { isFallback, fallback: Fallback, children } = props

	if (isFallback) {
		return <Fallback />
	}

	return <>{children}</>
}
