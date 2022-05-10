import { Link } from "gatsby"
import { getImage, ImageDataLike } from "gatsby-plugin-image"
import React from "react"

import Bio from "@app/components/blog/bio/Bio"
import PostTags from "@app/components/blog/util/PostTags"

import * as styles from "./blogPostList.module.scss"

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
		featuredImage?: {
			childImageSharp?: ImageDataLike
		}
	}
	excerpt: string
}

const BlogPostListEntryDisplay = (props: { data: BlogPostListEntry }) => {
	const { data } = props

	return (
		<li className={styles.entry}>
			<Link to={data.fields.path} className={styles.entryHeader}>
				<h3>{data.frontmatter.title}</h3>
			</Link>
			<h6 className={styles.entryCreatedAt}>
				Created at {data.frontmatter.date}
			</h6>
			<PostTags
				className={styles.entryTags}
				tags={data.frontmatter.tags}
			/>
			<p className={styles.entryExcerpt}>{data.excerpt}</p>
		</li>
	)
}

export default (props: {
	entries: BlogPostListEntry[]
	title?: React.ReactNode
	subtitle?: React.ReactNode
}) => {
	const { entries, title, subtitle } = props

	return (
		<main className={styles.outer}>
			<aside className={styles.outerSidePanel}>
				<Bio orientation="vertical" />
			</aside>
			<section className={styles.outerList}>
				<header className={styles.outerHeader}>
					<h1>
						{title} ({entries.length})
					</h1>
					<p>{subtitle}</p>
					<hr />
				</header>
				<ul className={styles.postList}>
					{entries
						.map(e => ({
							...e,
							image:
								(e.frontmatter?.featuredImage?.childImageSharp
									? getImage(
											e.frontmatter.featuredImage
												.childImageSharp,
									  )
									: null) || null,
						}))
						.map(e => (
							<BlogPostListEntryDisplay key={e.id} data={e} />
						))}
				</ul>

				<hr />
				<footer>Total {entries.length} posts</footer>
			</section>
		</main>
	)
}
