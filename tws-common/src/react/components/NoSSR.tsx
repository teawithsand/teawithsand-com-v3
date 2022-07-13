import React, { ReactNode } from "react"
import { useIsSSR } from "tws-common/react/hook/isSSR"

const NoSSR = (props: { children?: ReactNode }) => {
	const isSSR = useIsSSR()

	if (isSSR) {
		return <></>
	} else {
		return <>{props.children}</>
	}
}

/**
 * Note: does not work with ref={...} and React.forwardRef.
 */
export const wrapNoSSR =
	<P,>(component: React.FC<P>): React.FC<P> =>
	// eslint-disable-next-line react/display-name
	(props: P) =>
		<NoSSR>{component(props)}</NoSSR>

export default NoSSR
