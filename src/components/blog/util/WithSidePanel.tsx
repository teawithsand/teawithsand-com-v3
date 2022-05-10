import React from "react"

import { useBreakpoint } from "@app/util/react/hook/dimensions/useBreakpoint"

import * as styles from "./withSidePanel.module.scss"

const SidePanel = (props: {}) => {
	return <aside>Side panel here</aside>
}

export default (props: { children: React.ReactNode }) => {
	const breakpoint = useBreakpoint()
	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer}>
				<div>{props.children}</div>
				<SidePanel />
			</div>
		</div>
	)
}
