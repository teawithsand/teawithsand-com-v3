import PostTags from "@app/components/blog/util/PostTags"
import classnames from "@app/util/lang/classnames"
import { Link } from "gatsby"
import {
	GatsbyImage,
	getImage,
	IGatsbyImageData,
	ImageDataLike,
} from "gatsby-plugin-image"
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
		featuredImage?: {
			childImageSharp?: ImageDataLike
		}
	}
	excerpt: string
}

const BlogPostListEntryDisplay = (props: { data: BlogPostListEntry }) => {
	const { data } = props
	/*
	const image =
		(data.frontmatter?.featuredImage?.childImageSharp
			? getImage(data.frontmatter.featuredImage.childImageSharp)
			: null) || null
	*/
	const image = null

	/*
	{image ? (
		<GatsbyImage
			className={styles.postEntryImage}
			image={image}
			alt={data.frontmatter.title}
		/>
	) : (
		<div className={styles.postEntryImagePolyfill}></div>
	)}
	*/

	return (
		<li className={styles.postEntry}>
			<Link to={data.fields.path} className={styles.postEntryHeader}>
				<h3>{data.frontmatter.title}</h3>
			</Link>
			<h6 className={styles.postEntryCreatedAt}>
				Created at {data.frontmatter.date}
			</h6>
			<PostTags
				className={styles.postEntryTags}
				tags={data.frontmatter.tags}
			/>
			<p className={styles.postEntryExcerpt}>{data.excerpt}</p>
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
					{entries
						.map(e => ({
							...e,
							image:
								(e.frontmatter?.featuredImage?.childImageSharp
									? getImage(
											e.frontmatter.featuredImage
												.childImageSharp
									  )
									: null) || null,
						}))
						.map(v => {
							console.log({
								v,
								src: v.frontmatter.featuredImage,
								image: v.image,
							})
							return v
						})
						.map((e, i: number) => (
							<BlogPostListEntryDisplay key={e.id} data={e} />
						))}
				</ul>
			</section>
			<hr />
			<footer>Total {entries.length} posts</footer>
		</main>
	)
}
