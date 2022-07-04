import React from "react"
import { useDispatch } from "react-redux"

import { setTool } from "@app/components/redux-dom-paint/redux/paintActions"
import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"

import * as styles from "./paintDrawPanel.module.scss"

const ToolSection = () => {
	const dispatch = useDispatch()

	return (
		<div className={styles.section}>
			<ButtonDropdown
				defaultLabel="Tool options"
				className={styles.sectionHeaderButton}
			>
				<div className={styles.sectionInputContainer}>
					<div className={styles.sectionButtonBar}>
						<button
							className={styles.sectionMainButton}
							onClick={() => {
								dispatch(setTool("path"))
							}}
						>
							Draw
						</button>
						<button
							className={styles.sectionMainButton}
							onClick={() => {
								dispatch(setTool("scroll"))
							}}
						>
							Move canvas
						</button>
					</div>
				</div>
			</ButtonDropdown>
		</div>
	)
}

export default ToolSection
