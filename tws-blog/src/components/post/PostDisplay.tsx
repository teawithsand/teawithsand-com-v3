import { Post, PostHeader } from "@app/domain/Post"
import { Helmet } from "react-helmet"
import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import SmallTagList from "@app/components/tag/SmallTagList"
import { breakpointMediaDown, BREAKPOINT_SM } from "tws-common/react/hook/dimensions/useBreakpoint"

const ArticleHeader = styled.header`
	margin-bottom: 1rem;

	& > h1 {
		padding: 0;
		margin: 0;
	}

	row-gap: 0.2rem;
	display: grid;
	grid-template-rows: auto;
	grid-template-columns: auto;
	grid-auto-flow: auto;

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		text-align: center;
		align-items: center;
		justify-content: center;
	}
`

const ArticleFooter = styled.footer``

const ArticleContent = styled.div`
	& h1 {
		font-size: 2.3rem;
		font-weight: 400;
	}
`

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
	const formatDate = useAppTranslationSelector(s => s.common.formatDate)
	const { post } = props
	const { header } = post
	return (
		<article>
			<ArticleHeader>
				<h1>{header.title}</h1>
				<span>
					Created at: <time>{formatDate(header.createdAt)}</time>
				</span>
				{header.lastEditedAt ? (
					<span>Last edited at: {formatDate(header.createdAt)}</span>
				) : null}
				<span>
					<SmallTagList tags={header.tags} />
				</span>
			</ArticleHeader>
			<ArticleContent
				dangerouslySetInnerHTML={{
					__html: post.contentHTML,
				}}
			></ArticleContent>
			<ArticleFooter>
				TODO comments here or things like next/prev posts
			</ArticleFooter>
		</article>
	)
}
