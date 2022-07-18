import { ImageDataLike } from "gatsby-plugin-image"

export interface PostHeader {
	title: string
	createdAt: string
	lastEditedAt?: string | null | undefined
	featuredImage?: ImageDataLike | null | undefined
	readingTime: string
	tags: string[]
	path: string
}
