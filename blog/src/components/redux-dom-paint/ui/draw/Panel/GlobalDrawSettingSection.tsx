import React from "react"
import { useDispatch } from "react-redux"

import {
	setDrawColor,
	setFillColor,
} from "@app/components/redux-dom-paint/redux/paintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/redux/paintSelectors"
import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"
import { encodeColor, encodeColorForInput, parseColor } from "tws-common/color"

import * as styles from "./paintDrawPanel.module.scss"

const GlobalDrawSettingsSection = () => {
	const dispatch = useDispatch()

	const strokeColor = usePaintStateSelector(s => s.uiState.drawColor)
	const fillColor = usePaintStateSelector(s => s.uiState.fillColor)

	return (
		<div className={styles.section}>
			<ButtonDropdown
				defaultLabel="Global settings"
				className={styles.sectionHeaderButton}
			>
				<div className={styles.section}>
					<div className={styles.colorShowcase}>
						<div className={styles.colorShowcaseDescription}>
							Stroke color:
						</div>
						<input
							className={styles.colorShowcasePicker}
							type="color"
							value={encodeColorForInput(strokeColor)}
							onChange={e => {
								dispatch(
									setDrawColor(parseColor(e.target.value)),
								)
							}}
						/>
						<div
							className={styles.colorShowcaseElement}
							style={{
								["--showcase-color" as any]:
									encodeColor(strokeColor),
							}}
						></div>

						<div className={styles.colorShowcaseDescription}>
							Fill color:
						</div>
						<input
							className={styles.colorShowcasePicker}
							type="color"
							value={encodeColorForInput(
								fillColor ?? [255, 255, 255, 0],
							)}
							onChange={e => {
								dispatch(
									setFillColor(parseColor(e.target.value)),
								)
							}}
						/>
						<div
							className={styles.colorShowcaseElement}
							style={{
								["--showcase-color" as any]: encodeColor(
									fillColor ?? [0, 0, 0, 0],
								),
							}}
						></div>
					</div>

					<button
						className={styles.sectionMainButton}
						onClick={() => {
							dispatch(setFillColor(null))
						}}
					>
						Remove fill
					</button>
				</div>
			</ButtonDropdown>
		</div>
	)
}

export default GlobalDrawSettingsSection
