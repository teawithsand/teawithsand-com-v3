import React from "react"
import { ReactElement, ReactFragment, ReactNode } from "react"

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	return <>{props.children}</>
}

export default Layout
