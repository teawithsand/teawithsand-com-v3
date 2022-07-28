import { IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"

import { asNonNullable } from "tws-common/typing/required"

export interface ShrineHeader {
	title: string
	slug: string
	createdAt: string
	lastEditedAt: string | null
	coordinates: [number, number]
	tags: string[]
	path: string
	excerpt: string
	featuredImage: ImageDataLike | IGatsbyImageData | null
}

export interface ShrineHeaderExt extends ShrineHeader {
	featuredImageSocial: ImageDataLike | IGatsbyImageData | null
}

export interface Shrine {
	header: ShrineHeaderExt
	galleryImages: (ImageDataLike | IGatsbyImageData)[]
	html: string
}

export interface ShrineReference {
	title: string
	tags: string[]
	createdAt: string
	path: string
}

export const convertShrineHeader = (
	fragment: Queries.ShrineHeaderFragment,
): ShrineHeader => ({
	title: asNonNullable(fragment.frontmatter?.title),
	path: asNonNullable(fragment.fields?.path),
	slug: asNonNullable(fragment.frontmatter?.slug),
	tags: asNonNullable(fragment.frontmatter?.tags?.map(v => asNonNullable(v))),
	coordinates: asNonNullable(fragment.frontmatter?.coordinates) as [
		number,
		number,
	],
	createdAt: asNonNullable(fragment.frontmatter?.createdAt),
	excerpt: asNonNullable(fragment.excerpt),
	featuredImage:
		fragment.frontmatter?.featuredImage?.childImageSharp?.gatsbyImageData ||
		null,
	lastEditedAt: fragment.frontmatter?.lastEditedAt || null,
})

export const convertShrine = (fragment: Queries.ShrineFragment): Shrine => ({
	header: {
		...convertShrineHeader(fragment),
		featuredImageSocial:
			fragment.frontmatter?.featuredImageSocial?.childImageSharp
				?.gatsbyImageData || null,
	},
	galleryImages: (fragment.frontmatter?.galleryImages || [])
		.map(v => v?.childImageSharp?.gatsbyImageData)
		.map(v => asNonNullable(v)),
	html: fragment.html || "",
})

export const convertShrineReference = (
	fragment: Queries.ShrineReferenceFragment,
): ShrineReference => ({
	title: asNonNullable(fragment.frontmatter?.title),
	createdAt: asNonNullable(fragment.frontmatter?.createdAt),
	path: asNonNullable(fragment.fields?.path),
	tags: asNonNullable(fragment.frontmatter?.tags?.map(v => asNonNullable(v))),
})
