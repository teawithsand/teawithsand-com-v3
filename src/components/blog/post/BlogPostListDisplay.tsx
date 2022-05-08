import PostTags from "@app/components/blog/util/PostTags"
import classnames from "@app/util/lang/classnames"
import { Link } from "gatsby"
import React from "react"

import * as styles from "./blogPostListDisplay.module.scss"

export type BlogPostListEntry = {
	id: string
	fields: {
		slug: string
		path: string
	}
	frontmatter: {
		title: string
		date: string
		tags: string[]
	}
	excerpt: string
}

export default (props: {
	entries: BlogPostListEntry[]
	title?: React.ReactNode
	subtitle?: React.ReactNode
}) => {
	const { entries, title, subtitle } = props

	return (
		<main className={styles.postListContainer}>
			<header className={styles.postListHeader}>
				<h1>
					{title} ({entries.length})
				</h1>
				<p>{subtitle}</p>
				<hr />
			</header>
			<section>
				<ul className={styles.postList}>
					{entries.map((e: any, i: number) => (
						<li
							key={e.id}
							className={classnames(
								styles.postEntry,
								styles.postListEntry
							)}
						>
							{i !== 0 ? <hr /> : null}
							<Link to={e.fields.path}>
								<h3>{e.frontmatter.title}</h3>
							</Link>
							<h6>Created at {e.frontmatter.date}</h6>
							<PostTags tags={e.frontmatter.tags} />
							<p className={styles.postEntryExcerpt}>
								{e.excerpt}
							</p>
						</li>
					))}
				</ul>
			</section>
			<hr />
			<footer>Total {entries.length} posts</footer>
		</main>
	)
}
