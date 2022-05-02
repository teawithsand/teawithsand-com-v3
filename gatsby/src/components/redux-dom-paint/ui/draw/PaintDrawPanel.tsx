import { homePath } from "@app/components/paths"
import {
	encodeColor,
} from "@app/components/redux-dom-paint/primitive"
import {
	redoUndoneMutation,
	undoCommittedMutation,
} from "@app/components/redux-dom-paint/ui/redux/PaintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/ui/redux/PaintSelectors"
import { Link } from "gatsby"
import React from "react"
import { useDispatch } from "react-redux"

import * as styles from "./paintDrawPanel.module.scss"

export default (props: {
	showToggleButton?: boolean
	onTogglePanel?: () => void
}) => {
	const tool = usePaintStateSelector(s => s.tool)
	const undoCount = usePaintStateSelector(s => s.committedMutations.length)
	const redoCount = usePaintStateSelector(s => s.redoStack.length)

	const strokeColor = usePaintStateSelector(s => s.uiState.drawColor)
	const fillColor = usePaintStateSelector(s => s.uiState.fillColor)

	const dispatch = useDispatch()

	const { showToggleButton, onTogglePanel } = props
	return (
		<div className={styles.panel}>
			{showToggleButton ? (
				<div className={styles.section}>
					<button
						className={styles.sectionMainButton}
						onClick={() => {
							if (onTogglePanel) onTogglePanel()
						}}
					>
						Toggle panel
					</button>
				</div>
			) : null}

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>General</h2>
				<Link className={styles.sectionMainButton} to={homePath}>
					Go to home page
				</Link>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Edition operations</h2>
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

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Global settings</h2>
				<div className={styles.colorShowcase}>
					<div className={styles.colorShowcaseDescription}>Stroke color:</div>
                    <input
						className={styles.colorShowcasePicker}
						type="color"
						value={encodeColor(fillColor ?? [0, 0, 0, 0])}
						onChange={e => {}}
					/>
					<div
						className={styles.colorShowcaseElement}
						style={{
							["--showcase-color" as any]: encodeColor(strokeColor),
						}}
					></div>

					<div className={styles.colorShowcaseDescription}>Fill color:</div>
					<input
						className={styles.colorShowcasePicker}
						type="color"
						value={encodeColor(fillColor ?? [0, 0, 0, 0])}
						onChange={e => {}}
					/>
					<div
						className={styles.colorShowcaseElement}
						style={{
							["--showcase-color" as any]: encodeColor(
								fillColor ?? [0, 0, 0, 0]
							),
						}}
					></div>
				</div>
			</div>
		</div>
	)
}
