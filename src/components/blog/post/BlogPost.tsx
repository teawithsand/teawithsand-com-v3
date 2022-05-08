import { blogPostListPath, homePath } from "@app/components/paths"
import Seo from "@app/components/seo"
import { Link } from "gatsby"
import React from "react"

import DisqusTemplate from "./Disqus"
import * as styles from "./blogPost.module.scss"
import PostTags from "@app/components/blog/util/PostTags"
import WithSidePanel from "@app/components/blog/util/WithSidePanel"

export interface BlogPostData {
	id: string
	excerpt: string
	html: string
	fields: {
		slug: string
		path: string
	}
	frontmatter: {
		title: string
		date: string
		description: string
		tags?: string[] | undefined | null
	}
}

export interface RefBlogPostData {
	fields: {
		slug: string
		path: string
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
					post list <Link to={blogPostListPath}>here</Link> or go
					to <Link to={homePath}>home page here</Link>.
				</aside>
				<article itemScope itemType="http://schema.org/Article">
					<header>
						<h1 itemProp="headline">
							{post.frontmatter.title}
						</h1>
						<p>Created at: {post.frontmatter.date}</p>
						<p>
							<PostTags tags={post.frontmatter.tags} />
						</p>
					</header>
					<hr />

					<section
						dangerouslySetInnerHTML={{ __html: post.html }}
						itemProp="articleBody"
					></section>

					<hr />
					<footer className={styles.postFooter}>
						{prev ? (
							<div className={styles.postFooterPrev}>
								<div className={styles.postFooterPrevTitle}>
									<Link to={prev.fields.path} rel="prev">
										{prev.frontmatter.title}
									</Link>
								</div>
								<div className={styles.postFooterPrevDesc}>
									<Link to={prev.fields.path} rel="prev">
										Previous post
									</Link>
								</div>
							</div>
						) : null}
						{next ? (
							<div className={styles.postFooterNext}>
								<div className={styles.postFooterPrevTitle}>
									<Link to={next.fields.path} rel="next">
										{next.frontmatter.title}
									</Link>
								</div>
								<div className={styles.postFooterPrevDesc}>
									<Link to={next.fields.path} rel="next">
										Next post
									</Link>
								</div>
							</div>
						) : null}
					</footer>
				</article>
				<hr />
				<section>
					<DisqusTemplate
						pageIdentifier={post.fields.slug}
						pageURL={
							// TODO(teawithsand): replace this with metadata entry
							"https://www.teawithsand.com" + post.fields.path
						}
						pageTitle={post.frontmatter.title}
					/>
				</section>
			</main>
		</>
	)
}
