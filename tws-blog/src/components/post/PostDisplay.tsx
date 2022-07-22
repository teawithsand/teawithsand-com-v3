import { Post, PostHeader } from "@app/domain/Post"
import { Helmet } from "react-helmet"
import React, { useLayoutEffect, useMemo, useRef, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import SmallTagList from "@app/components/tag/SmallTagList"
import {
	breakpointMediaDown,
	BREAKPOINT_SM,
} from "tws-common/react/hook/dimensions/useBreakpoint"

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

		// TODO(teawithsand): this is hack, make some better selector here
		& .tags > * {
			align-items: center;
			justify-content: center;
		}
	}
`

const ArticleFooter = styled.footer``

const ArticleContent = styled.div`
	& h1 {
		font-size: 2.3rem;
		font-weight: 400;
	}

	& blockquote {
		background-color: rgba(0, 0, 0, 0.0625);
		padding: 0.3rem;
		border-radius: 0.3rem;
		border-left: 10px solid rgba(0, 0, 0, 0.125);

		font-style: italic;

		margin-bottom: 7px;
		margin-top: 7px;
		// margin-left: 10%;
		// margin-right: 10%;

		& p {
			display: inline;
			padding: 0;
			margin: 0;

			&::before {
				content: "\\201C";
				display: inline;
				touch-action: none;
				user-select: none;
			}

			&::after {
				content: "\\201D";
				display: inline;
				touch-action: none;
				user-select: none;
			}
		}
	}

	& figure.gatsby-resp-image-figure {
		overflow: hidden;
		& > span {
			overflow: hidden;
			max-height: max(80vh, 200px);

			& img {
				object-fit: contain;
			}
		}

		& figcaption.gatsby-resp-image-figcaption {
			padding-top: 0.3rem;
			text-align: center;

			color: rgba(0, 0, 0, 0.65);
			font-size: 1rem;
		}
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

	// HACK: add rel="noopener noreferrer" using regex
	// do not try that yourself.
	const content = useMemo(() => {
		return post.contentHTML.replace(
			/<a(.*?)href="(.*?)"(.*?)>/gim,
			`<a $1 href="$2" rel="noopener noreferrer" $3>`,
		)
	}, [post.contentHTML])

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
				<span className="tags">
					<SmallTagList tags={header.tags} />
				</span>
			</ArticleHeader>
			<ArticleContent
				dangerouslySetInnerHTML={{
					__html: content,
				}}
			></ArticleContent>
			<ArticleFooter>
				TODO comments here or things like next/prev posts
			</ArticleFooter>
		</article>
	)
}
