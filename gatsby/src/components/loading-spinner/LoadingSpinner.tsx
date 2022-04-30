import React from "react"

import { StaticImage } from "gatsby-plugin-image"
import styles from "./loadingSpinner.module.scss"

export default () => {
	console.log({ styles })
	return (
		<div className={styles.spinner}>
			<StaticImage
				alt={"Loading..."}
				src="./loading.svg"
				className={styles.spinnerImage}
			/>
			<div className={styles.spinnerText}>Loading...</div>
		</div>
	)
}
