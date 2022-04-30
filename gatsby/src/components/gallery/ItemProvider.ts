import { GalleryItem } from "@app/components/gallery/GalleryItem"
import { GalleryMode } from "@app/components/gallery/GalleryNavigation"

export type GalleryItemProviderOptions = {
	mode: GalleryMode
}

export type GalleryItemProviderContext = "main" | "summary"

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
