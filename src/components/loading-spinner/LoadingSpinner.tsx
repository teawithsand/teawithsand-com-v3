import React from "react"

import * as styles from "./loadingSpinner.module.scss"
import LoadingImage from "./loading.svg"

export default () => {
	return (
		<div className={styles.spinner}>
			<LoadingImage
				width={150}
				height={150}
				alt={"Loading..."}
				src="./loading.svg"
				className={styles.spinnerImage}
			/>
			<div className={styles.spinnerText}>Loading...</div>
		</div>
	)
}
