import { Post, PostHeader } from "@app/domain/Post"
import { Helmet } from "react-helmet"
import React from "react"
import { graphql, useStaticQuery } from "gatsby"

export const PostHelmet = (props: { post: PostHeader }) => {
	const query: Queries.PostHelmetMetaQuery = useStaticQuery(graphql`
		query PostHelmetMeta {
			site {
				siteMetadata {
					siteUrl
				}
			}
		}
	`)
	let domain = query.site?.siteMetadata?.siteUrl || ""
	if (!domain.endsWith("/")) domain = domain + "/"
	const { post } = props
	return (
		<Helmet>
			<title>{post.title}</title>

			<link rel="canonical" href={domain + post.path} />
			{post.tags.length > 0 ? (
				<meta
					name="keywords"
					content={post.tags.slice(0, 3).join(", ")}
				/>
			) : null}
			{/* https://clutch.co/seo-firms/resources/meta-tags-that-improve-seo */}
			{/* TODO(teawithsand): add meta description */}
		</Helmet>
	)
}

export const PostDisplay = (props: {
	post: Post
	nextPost: PostHeader | null
	prevPost: PostHeader | null
}) => {
	const { post } = props
	const { header } = post
	return (
		<article>
			<header>
				<h1>{header.title}</h1>
				<div
					dangerouslySetInnerHTML={{
						__html: post.contentHTML,
					}}
				></div>
				<footer>
					TODO comments here or things like next/prev posts
				</footer>
			</header>
		</article>
	)
}
