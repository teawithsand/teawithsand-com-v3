import React, { useState } from "react"

import ButtonDropdown from "@app/components/util/collapse/ButtonCollapse"
import WithUniqueId from "tws-common/react/components/WithUniqueId"

import * as styles from "./paintDrawPanel.module.scss"

// TODO(teawithsand): move this hack somewhere else
const download = (filename: string, url: string) => {
	const element = document.createElement("a")
	element.setAttribute("href", url)
	element.setAttribute("download", filename)
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

const ExportSection = (props: { svgDataURLHackGetter: () => string }) => {
	const [exportFileName, setExportFileName] = useState("drawing.svg")

	return (
		<div className={styles.section}>
			<ButtonDropdown
				defaultLabel="Export"
				className={styles.sectionHeaderButton}
			>
				<div className={styles.section}>
					<div className={styles.sectionInputContainer}>
						<WithUniqueId>
							{id => (
								<>
									<label htmlFor={id}>
										Export file name(without .svg)
									</label>
									<input
										id={id}
										type="text"
										value={exportFileName}
										onChange={v => {
											setExportFileName(v.target.value)
										}}
									/>
								</>
							)}
						</WithUniqueId>
					</div>
					<button
						className={styles.sectionMainButton}
						onClick={() => {
							download(
								exportFileName + ".svg",
								props.svgDataURLHackGetter(),
							)
						}}
					>
						Download image
					</button>
				</div>
			</ButtonDropdown>
		</div>
	)
}

export default ExportSection
