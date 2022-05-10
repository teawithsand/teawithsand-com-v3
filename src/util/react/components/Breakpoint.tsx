import React, { ReactFragment, useMemo } from "react"

import {
	Breakpoint,
	breakpointIndex,
	useBreakpointIndex,
} from "@app/util/react/hook/dimensions/useBreakpoint"

export default (props: {
	breakpoint: Breakpoint
	children: ReactFragment
	onHidden?: ReactFragment

	// True, if element should be shown
	comparator: (
		givenBreakpointIndex: number,
		currentBreakpointIndex: number,
	) => boolean
}) => {
	const { comparator, children, onHidden } = props
	const currentBreakpoint = useBreakpointIndex()
	const givenBreakpoint = breakpointIndex(props.breakpoint)

	const show = useMemo(
		() => comparator(givenBreakpoint, currentBreakpoint),
		[comparator, currentBreakpoint, givenBreakpoint],
	)

	if (show) {
		return <>{children}</>
	} else {
		return <>{onHidden}</>
	}
}
