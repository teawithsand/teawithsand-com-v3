import * as styles from "./bio.module.scss"
import React from "react"
import { StaticImage } from "gatsby-plugin-image"

export default (props: { orientation: "horizontal" | "vertical" }) => {
	const { orientation } = props
	return (
		<div className={styles.outerContainer}>
			<StaticImage
				src="./me.jpg"
				alt="Me on the picture"
				className={styles.image}
			/>
			<p className={styles.description}>
				{/*
				TODO(teawithsand): move this bio text somewhere else 
				*/}
				My name is Przemysław Głowacki(AKA teawithsand) and sometimes I
				write some posts or create YouTube videos.
			</p>
		</div>
	)
}
