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

export default NoSSR
