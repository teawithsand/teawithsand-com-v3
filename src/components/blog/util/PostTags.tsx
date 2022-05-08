import { blogTagPath } from "@app/components/paths"
import classnames from "@app/util/lang/classnames"
import { Link } from "gatsby"
import React from "react"

import * as styles from "./postTags.module.scss"

export default (props: {
	emptyIfNoTags?: boolean
	tags?: string[] | null | undefined
}) => {
	let { tags, emptyIfNoTags } = props
	tags = tags ?? []

	if (tags.length === 0)
		if (emptyIfNoTags) {
			return <></>
		} else {
			return (
				<span className={classnames(styles.tags, styles.noTags)}>
					No Tags
				</span>
			)
		}

	return (
		<ul className={classnames(styles.tags, styles.tagsList)}>
			<li className={styles.tagsHeader}>Tags: </li>
			{tags.map((t, i) => (
				<li key={i}>
					<Link className={styles.tagsTag} to={blogTagPath(t)}>
						{"#"}
						{t}
					</Link>
				</li>
			))}
		</ul>
	)
}
