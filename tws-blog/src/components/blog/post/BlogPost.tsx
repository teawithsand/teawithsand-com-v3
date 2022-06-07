import { Link } from "gatsby"
import React from "react"

import Bio from "@app/components/blog/bio/Bio"
import PostTags from "@app/components/blog/util/PostTags"

import classnames from "tws-common/lang/classnames"

import * as styles from "./blogPost.module.scss"
import DisqusTemplate from "./Disqus"

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

const BlogPost = (props: {
	next?: RefBlogPostData | null | undefined
	prev?: RefBlogPostData | null | undefined
	post: BlogPostData
}) => {
	const { next, prev, post } = props

	const Footer = () => (
		<>
			{prev ? (
				<div className={styles.articleFooterPrev}>
					<div className={styles.articleFooterPrevTitle}>
						<Link to={prev.fields.path} rel="prev">
							{prev.frontmatter.title}
						</Link>
					</div>
					<div className={styles.articleFooterPrevDesc}>
						<Link to={prev.fields.path} rel="prev">
							Previous post
						</Link>
					</div>
				</div>
			) : null}
			{next ? (
				<div className={styles.articleFooterNext}>
					<div className={styles.articleFooterNextTitle}>
						<Link to={next.fields.path} rel="next">
							{next.frontmatter.title}
						</Link>
					</div>
					<div className={styles.articleFooterNextDesc}>
						<Link to={next.fields.path} rel="next">
							Next post
						</Link>
					</div>
				</div>
			) : null}

			{prev || next ? <hr /> : null}
		</>
	)

	const RightSideBio = () => (
		<aside className={classnames(styles.outerSidePanel)}>
			<Bio orientation="vertical" />
		</aside>
	)
	const BottomBio = () => (
		<aside className={classnames(styles.articleBio)}>
			<Bio orientation="horizontal" />
		</aside>
	)
	return (
		<main className={styles.outer}>
			<RightSideBio />
			<article
				className={classnames(styles.outerArticle, styles.article)}
			>
				<header
					className={classnames(
						styles.articleHeader,
						styles.articleHeaderTitle,
					)}
				>
					<h1 className={styles.articleHeaderTitle}>
						{post.frontmatter.title}
					</h1>
					<span className={styles.articleHeaderCreatedAt}>
						Created at {post.frontmatter.date}
					</span>
					<PostTags
						tags={post.frontmatter.tags}
						className={styles.articleHeaderTags}
					/>
				</header>

				<hr />

				<div
					className={styles.articleContent}
					dangerouslySetInnerHTML={{ __html: post.html }}
				></div>

				<hr />

				<footer className={styles.articleFooter}>
					<Footer />
				</footer>

				<BottomBio />

				<hr />

				<aside className={styles.articleComments}>
					<DisqusTemplate
						pageIdentifier={post.fields.slug}
						pageURL={
							// TODO(teawithsand): replace this with metadata entry
							"https://www.teawithsand.com" + post.fields.path
						}
						pageTitle={post.frontmatter.title}
					/>
				</aside>
			</article>
		</main>
	)
}

export default BlogPost
