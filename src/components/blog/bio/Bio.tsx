import * as styles from "./bio.module.scss"
import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Bio = (props: { orientation: "horizontal" | "vertical" }) => {
	const { orientation } = props
	const description = (
		<p className={styles.description}>
			{/*
			TODO(teawithsand): move this bio text somewhere else 
			*/}
			My name is <b>Przemysław Głowacki</b>(AKA <b>teawithsand</b>) and
			sometimes I write some posts or create YouTube videos. I also write
			software and sometimes it turns out to be useful.
		</p>
	)
	if (orientation === "vertical") {
		return (
			<div className={styles.outer}>
				<StaticImage
					src="./me.png"
					alt="Me on the picture"
					className={styles.image}
					width={100}
					height={100}
				/>
				{description}
			</div>
		)
	} else if (orientation === "horizontal") {
		return (
			<div className={styles.outer}>
				<StaticImage
					src="./me.png"
					alt="Me on the picture"
					className={styles.image}
					width={100}
					height={100}
					style={{
						float: "left",
					}}
				/>
				{description}
			</div>
		)
	}
}

export default Bio
