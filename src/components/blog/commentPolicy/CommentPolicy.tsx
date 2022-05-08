import React from "react"

import * as styles from "./commentPolicy.module.scss"

export default () => {
	return (
		<main className={styles.mainContainer}>
			<header className={styles.mainContainerHeader}>
				<h1>Comment policy</h1>
			</header>
			<section>
				<p>
					The comment policy is simple: I'll remove comments I
					consider bad/offending and stuff. Aside from that, comments
					should be ok.
				</p>
				<p>
					This is known as{" "}
					<a href="https://en.wikipedia.org/wiki/Benevolent_dictator_for_life">
						BDFL
					</a>{" "}
					model of managing something.
				</p>
			</section>
		</main>
	)
}
