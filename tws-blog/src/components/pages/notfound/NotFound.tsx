import { Link } from "gatsby"
import React from "react"

import { homePath } from "@app/components/paths"

import * as styles from "./notFound.module.scss"

export default () => {
	return (
		<div className={styles.parentContainer}>
			<h1>Page was not found</h1>
			<br />
			<Link className={styles.homeLink} to={homePath}>
				Go to home page
			</Link>
		</div>
	)
}
