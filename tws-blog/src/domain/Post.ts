import { ImageDataLike, IGatsbyImageData } from "gatsby-plugin-image"

export interface PostHeader {
	title: string
	slug: string
	createdAt: string
	lastEditedAt?: string | null | undefined
	featuredImage?: ImageDataLike | IGatsbyImageData | null | undefined
	timeToRead: number
	tags: string[]
	path: string
	excerpt: string
	language: string
}

export interface ExtPostHeader extends PostHeader {
	featuredImageSocial?: ImageDataLike | IGatsbyImageData | null | undefined
}

export interface Post {
	header: ExtPostHeader
	contentHTML: string
}
