import React, { ReactNode, useEffect, useMemo } from "react"
import { Helmet } from "react-helmet"
import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { Language, parseLanguage } from "tws-common/trans/language"

export type SEOTwitter = {
	siteTwitter?: string
	creatorTwitter?: string
	twitterDescription?: string
	twitterTitle?: string
	twitterType?: "summary" | "summary_large_image"
}

export type SEOImage = {
	httpUrl: string // must be absolute
	httpsUrl: string // must be absolute

	alt?: string
	width?: number
	height?: number
}

export type SEOWebsite = {}

export type SEOArticle = {
	// TODO(teawithsand): add published_time, modified time and stuff
	// from https://ogp.me/#no_vertical
}

export type SEOProps = (
	| {
			type: "website"
			websiteData: SEOWebsite
	  }
	| {
			type: "article"
			articleData: SEOArticle
	  }
	| {
			type?: undefined
	  }
) & {
	language?: Language
	alternativeLanguages?: Language[]
	title?: string
	description?: string
	keywords?: string[]

	timeToLifeSeconds?: number

	// A few words of site name
	// for og:site_name meta
	siteName?: string

	canonicalUrl?: string

	image?: SEOImage
	twitter?: SEOTwitter

	children?: ReactNode
}

const LOG_TAG = claimId(NS_LOG_TAG, "tws-common/seo")

// TODO(teawithsand): add og:audio and og:video

export const Seo = (props: SEOProps) => {
	const {
		language: rawLanguage,
		alternativeLanguages,
		siteName,
		title,
		description,
		keywords,
		type,
		twitter: {
			siteTwitter,
			creatorTwitter,
			twitterType,
			twitterTitle,
			twitterDescription,
		} = {},
		image: {
			httpUrl: imageHttpUrl,
			httpsUrl: imageHttpsUrl,
			height: imageHeight,
			width: imageWidth,
			alt: imageAlt,
		} = {},
		canonicalUrl,
		timeToLifeSeconds,
	} = props

	const usedTwitterDescription = description ?? twitterDescription
	const usedTwitterTitle = title ?? twitterTitle

	const language = useMemo(
		() => (rawLanguage && parseLanguage(rawLanguage)) || null,
		[rawLanguage],
	)

	useEffect(() => {
		if (siteTwitter && !siteTwitter.startsWith("@"))
			LOG.warn(
				LOG_TAG,
				"Site twitter must start with @ character. Following given:",
				siteTwitter,
			)

		if (creatorTwitter && !creatorTwitter.startsWith("@"))
			LOG.warn(
				LOG_TAG,
				"Creator twitter must start with @ character. Following given:",
				creatorTwitter,
			)
	}, [siteTwitter, creatorTwitter])

	useEffect(() => {
		if (imageHttpUrl && !imageHttpUrl.startsWith("http://")) {
			LOG.warn(
				LOG_TAG,
				"Image HTTP url must start with http:// AKA it must be absolute. Following given",
				imageHttpUrl,
			)
		}
	}, [imageHttpUrl])

	useEffect(() => {
		if (imageHttpsUrl && !imageHttpsUrl.startsWith("https://")) {
			LOG.warn(
				LOG_TAG,
				"Image HTTPS url must start with https:// AKA it must be absolute. Following given",
				imageHttpsUrl,
			)
		}
	}, [imageHttpsUrl])

	useEffect(() => {
		if (usedTwitterDescription && usedTwitterDescription.length > 200) {
			LOG.error(
				LOG_TAG,
				"Twitter's description mustn't be longer than 200 characters. It has: ",
				usedTwitterDescription.length,
			)
		}
	}, [usedTwitterDescription])

	useEffect(() => {
		if (usedTwitterTitle && usedTwitterTitle.length > 70) {
			LOG.error(
				LOG_TAG,
				"Twitter's title mustn't be longer than 70 characters. It has: ",
				usedTwitterTitle.length,
			)
		}
	}, [usedTwitterTitle])

	useEffect(() => {
		if (description && description.length > 160) {
			LOG.warn(
				LOG_TAG,
				"Meta description shouldn't be longer than ~155-160 characters, main reason being google. It has:",
				description.length,
			)
		}
	}, [description])

	useEffect(() => {
		// See
		// https://stackoverflow.com/questions/50920398/how-much-is-maximum-value-of-ogttl-of-facebook-sharing
		if (
			typeof timeToLifeSeconds === "number" &&
			(timeToLifeSeconds > 2419200 || timeToLifeSeconds < 354600)
		) {
			LOG.error(
				LOG_TAG,
				"Facebook requires og:ttl to be in between 354600 and 2419200 seconds. It's set to:",
				timeToLifeSeconds,
			)
		}
	}, [timeToLifeSeconds])

	const image = [
		...(imageHttpUrl
			? [
					{
						name: "og:image",
						content: imageHttpUrl,
					},
			  ]
			: []),
		...(imageHttpsUrl
			? [
					{
						name: "og:image:secure",
						content: imageHttpsUrl,
					},
			  ]
			: []),
		...(imageWidth
			? [
					{
						name: "og:image:width",
						content: `${imageWidth}`,
					},
			  ]
			: []),
		...(imageHeight
			? [
					{
						name: "og:image:height",
						content: `${imageHeight}`,
					},
			  ]
			: []),
		...(imageAlt
			? [
					{
						name: "og:image:alt",
						content: imageAlt,
					},
					{
						name: "twitter:image:alt",
						content: imageAlt,
					},
			  ]
			: []),
	]

	const twitter = [
		...(siteTwitter || creatorTwitter
			? [
					{
						name: "twitter:card",
						content: twitterType ?? "summary",
					},
					...(usedTwitterTitle
						? [
								{
									name: "twitter:title",
									content: usedTwitterTitle,
								},
						  ]
						: []),
					...(usedTwitterDescription
						? [
								{
									name: "twitter:description",
									content: usedTwitterDescription,
								},
						  ]
						: []),
			  ]
			: []),
		...(siteTwitter
			? [
					{
						name: "twitter:site",
						content: siteTwitter,
					},
			  ]
			: []),
		...(creatorTwitter
			? [
					{
						name: "twitter:creator",
						content: creatorTwitter,
					},
			  ]
			: []),
	]

	return (
		<Helmet
			title={title}
			htmlAttributes={
				language
					? {
							lang: language.simpleLanguage,
					  }
					: undefined
			}
			link={[
				...(canonicalUrl
					? [
							{
								rel: "canonical",
								href: canonicalUrl,
							},
					  ]
					: []),
			]}
			meta={[
				...(description !== undefined
					? [
							{
								name: "og:description",
								content: description,
							},
							{
								name: "description",
								content: description,
							},
					  ]
					: []),
				...(language
					? [
							{
								httpEquiv: "content-language",
								content: language.language.toLowerCase(),
							},
					  ]
					: []),
				...(title !== undefined
					? [
							{
								name: "og:title",
								content: title,
							},
					  ]
					: []),
				...(type
					? [
							{
								name: "og:type",
								content: type,
							},
					  ]
					: []),
				...(language
					? [
							{
								name: "og:locale",
								content: language.language.replace("-", "_"),
							},
					  ]
					: []),

				...(typeof timeToLifeSeconds === "number"
					? [
							{
								name: "og:ttl",
								content: `${timeToLifeSeconds}`,
							},
					  ]
					: []),

				...(alternativeLanguages ?? []).map(v => ({
					name: "og:locale:alternative",
					content: v,
				})),

				...(siteName
					? [
							{
								name: "og:site_name",
								content: siteName,
							},
					  ]
					: []),

				...(canonicalUrl
					? [
							{
								name: "og:url",
								content: canonicalUrl,
							},
					  ]
					: []),

				...(keywords && keywords.length > 0
					? [
							{
								name: "keywords",
								content: keywords
									.map(v => v.replace(",", " "))
									.join(", "),
							},
					  ]
					: []),

				...image,
				...twitter,
			]}
		>
			{props.children}
		</Helmet>
	)
}
