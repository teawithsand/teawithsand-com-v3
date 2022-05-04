import { GalleryItem } from "@app/components/gallery/GalleryItem"

export type GalleryItemProviderOptions = {}

export type GalleryItemProviderContext = "main" | "thumbnail" | "main-hidden"

export default interface GalleryItemProvider {
	readonly itemCount: number

	provideItem(
		i: number,
		context: GalleryItemProviderContext,
		options: GalleryItemProviderOptions
	): GalleryItem
}

export class ArrayGalleryItemProvider implements GalleryItemProvider {
	constructor(private readonly items: GalleryItem[]) {}

	get itemCount(): number {
		return this.items.length
	}

	provideItem = (
		i: number,
		context: GalleryItemProviderContext,
		options: GalleryItemProviderOptions
	): GalleryItem => {
		return this.items[i]
	}
}
