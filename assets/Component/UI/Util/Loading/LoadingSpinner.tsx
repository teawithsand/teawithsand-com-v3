import ImageUtil from "@app/util/react/image/ImageUtil"
import React from "react"

import loading from "@app/images/own/loading.svg"
import styles from "./loadingSpinner.scss?module"

export default () => {
    return <div className={styles.spinner}>
        <ImageUtil src={loading} className={styles.spinnerImage} />
        <div className={styles.spinnerText}>
            Loading...
        </div>
    </div>
}