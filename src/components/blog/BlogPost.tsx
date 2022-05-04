import { homePath } from "@app/components/paths"
import Seo from "@app/components/seo"
import { Link } from "gatsby"
import React, { useEffect } from "react"

import * as styles from "./blogPost.module.scss"

export interface BlogPostData {
	id: string
	excerpt: string
	html: string
	frontmatter: {
		title: string
		date: string
		description: string
	}
}

export interface RefBlogPostData {
	fields: {
		slug: string
	}
	frontmatter: {
		title: string
	}
}

export default (props: {
	next?: RefBlogPostData | null | undefined
	prev?: RefBlogPostData | null | undefined
	post: BlogPostData
}) => {
	let { post, next, prev } = props
	return (
		<>
			<Seo
				lang={"en"}
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
			/>

			<main className={styles.postContainer}>
				<aside className={styles.blogInfoHeader}>
					You are at blog part of this website. You can find blog
					post list <a href="#">here</a> or go to{" "}
					<Link to={homePath}>home page here</Link>.
				</aside>
				<article itemScope itemType="http://schema.org/Article">
					<header>
						<h1 itemProp="headline">{post.frontmatter.title}</h1>
						<p>Created at: {post.frontmatter.date}</p>
					</header>
					<section
						dangerouslySetInnerHTML={{ __html: post.html }}
						itemProp="articleBody"
					></section>

					<hr />
					<footer className={styles.postFooter}>
						{prev ? (
							<div className={styles.postFooterPrev}>
								<div className={styles.postFooterPrevTitle}>
									<Link
										to={"/blog/post" + prev.fields.slug}
										rel="prev"
									>
										{prev.frontmatter.title}
									</Link>
								</div>
								<div className={styles.postFooterPrevDesc}>
									<Link
										to={"/blog/post" + prev.fields.slug}
										rel="prev"
									>
										Previous post
									</Link>
								</div>
							</div>
						) : null}
						{next ? (
							<div className={styles.postFooterNext}>
								<div className={styles.postFooterPrevTitle}>
									<Link
										to={"/blog/post" + next.fields.slug}
										rel="next"
									>
										{next.frontmatter.title}
									</Link>
								</div>
								<div className={styles.postFooterPrevDesc}>
									<Link
										to={"/blog/post" + next.fields.slug}
										rel="next"
									>
										Next post
									</Link>
								</div>
							</div>
						) : null}
					</footer>
				</article>
			</main>
		</>
	)
}
