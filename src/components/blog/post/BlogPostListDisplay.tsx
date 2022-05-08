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

export default (props: { entries: BlogPostListEntry[] }) => {
	const { entries } = props

	return (
		<main className={styles.postListContainer}>
			<header className={styles.postListHeader}>
				<h1>Blog post list</h1>
				<p>
					For now it's short, so no search aside from ctrl+f is needed
				</p>
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
							<p>
								<PostTags tags={e.frontmatter.tags} />
							</p>
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
