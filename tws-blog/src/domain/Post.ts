import { ImageDataLike, IGatsbyImageData } from "gatsby-plugin-image"

export interface PostHeader {
	title: string
	createdAt: string
	lastEditedAt?: string | null | undefined
	featuredImage?: ImageDataLike | IGatsbyImageData | null | undefined
	timeToRead: number
	tags: string[]
	path: string
}
