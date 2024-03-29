import React from "react"

import {
	email,
	linkEmail,
	linkGithub,
	linkLinkedIn,
} from "@app/components/paths"

import * as styles from "./contact.module.scss"

export default () => {
	return (
		<main className={styles.pageContainer}>
			<article>
				<header className={styles.header}>
					<h1>Contact</h1>
				</header>

				<div className={styles.pageBody}>
					You can contact me via:
					<ul>
						<li>
							(Preferably) Email <a href={linkEmail}>{email}</a>
						</li>
					</ul>
					You can also find me at:
					<ul>
						<li>
							<a href={linkGithub}>GitHub</a>
						</li>
						<li>
							<a href={linkLinkedIn}>LinkedIn</a>
						</li>
					</ul>
				</div>
			</article>
		</main>
	)
}
