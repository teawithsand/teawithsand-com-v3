import { Link } from "gatsby"
import React from "react"

import { homePath } from "@app/components/paths"
import ExportSection from "@app/components/redux-dom-paint/ui/draw/Panel/ExportSection"
import GlobalDrawSettingsSection from "@app/components/redux-dom-paint/ui/draw/Panel/GlobalDrawSettingSection"
import HistorySection from "@app/components/redux-dom-paint/ui/draw/Panel/HistorySection"
import SceneSection from "@app/components/redux-dom-paint/ui/draw/Panel/SceneSection"

import * as styles from "./paintDrawPanel.module.scss"

const PaintDrawPanel = (props: {
	showToggleButton?: boolean
	onTogglePanel?: () => void

	svgDataURLHackGetter: () => string
}) => {
	const { showToggleButton, onTogglePanel } = props

	// TODO(teawithsand): allow swipes to hide this panel with useGesture
	return (
		<div className={styles.panel}>
			<div className={styles.section}>
				<h1 className={styles.sectionTopTitle}>TWS Paint App</h1>
			</div>

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>General</h2>
				<Link className={styles.sectionMainButton} to={homePath}>
					Go to home page
				</Link>
				{showToggleButton ? (
					<button
						className={styles.sectionMainButton}
						onClick={() => {
							if (onTogglePanel) onTogglePanel()
						}}
					>
						Toggle panel
					</button>
				) : null}
			</div>

			<GlobalDrawSettingsSection />
			<HistorySection />
			<SceneSection />
			<ExportSection svgDataURLHackGetter={props.svgDataURLHackGetter} />
		</div>
	)
}

export default PaintDrawPanel
