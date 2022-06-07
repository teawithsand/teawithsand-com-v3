import React from "react"
import { useDispatch } from "react-redux"

import {
	redoUndoneMutation,
	undoCommittedMutation,
} from "@app/components/redux-dom-paint/redux/paintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/redux/paintSelectors"
import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"

import * as styles from "./paintDrawPanel.module.scss"

const HistorySection = () => {
	const dispatch = useDispatch()

	const undoCount = usePaintStateSelector(s => s.committedMutations.length)
	const redoCount = usePaintStateSelector(s => s.redoStack.length)

	return (
		<div className={styles.section}>
			<ButtonDropdown
				defaultLabel="History"
				className={styles.sectionHeaderButton}
			>
				<div className={styles.section}>
					<div className={styles.sectionButtonBar}>
						<button
							onClick={() => {
								dispatch(undoCommittedMutation())
							}}
						>
							Undo
						</button>
						<button
							onClick={() => {
								dispatch(redoUndoneMutation())
							}}
						>
							Redo
						</button>
					</div>
					<ul className={styles.sectionInfoTextList}>
						<li>You can undo {undoCount} operations</li>
						<li>You can redo {redoCount} operations</li>
					</ul>
				</div>
			</ButtonDropdown>
		</div>
	)
}

export default HistorySection
