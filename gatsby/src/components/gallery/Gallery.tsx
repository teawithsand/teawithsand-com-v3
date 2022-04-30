import React, { useMemo } from "react"

import { GalleryMode } from "@app/components/gallery/GalleryNavigation"

import * as styles from "./gallery.module.scss"
import { DissolveGalleryDisplay } from "@app/components/gallery/GalleryDisplay"
import GalleryItemProvider from "@app/components/gallery/ItemProvider"
import GalleryItemDisplay from "@app/components/gallery/GalleryItemDisplay"

export type GalleryProps = {
	itemProvider: GalleryItemProvider
	mode: GalleryMode
	itemIndex: number
}

const Gallery = (props: GalleryProps) => {
	const { itemIndex, itemProvider, mode } = props
	const currentItem = useMemo(
		() =>
			itemProvider.provideItem(itemIndex, "main", {
				mode,
			}),
		[mode, itemIndex, itemProvider]
	)

	const thumbnails = useMemo(() => {
		const items = []
		for (let i = 0; i < itemProvider.itemCount; i++) {
			items.push(
				itemProvider.provideItem(i, "summary", {
					mode: "normal",
				})
			)
		}
		return items
	}, [itemProvider, mode])

	return (
		<div className={styles.gallery}>
			<div className={styles.mainBar}>
				{
					// Below wrapper note also applies to this div, which wraps display.
				}
				<div className={styles.mainBarEntryWrapper}>
					<DissolveGalleryDisplay item={currentItem} />
				</div>
			</div>
			<div className={styles.bottomBar}>
				{thumbnails.map(i => (
					// Quick note about that div:
					//  It's required, since it makes chrome and firefox behave the same way
					//  when it comes to displaying overflowing images/setting image width and/or height
					//  if that is not done, object-fit: contain will work on ff,
					//  but it won't on chrome
					//  it's like that, because chrome and ff differently understand specification
					//  for css height parameter with percentage value
					// 
					// I've spent too much time debugging it, so this div stays here.
					<div key={i.key} className={styles.bottomBarEntryWrapper}>
						<GalleryItemDisplay item={i} />
					</div>
				))}
			</div>
		</div>
	)
}

export default Gallery
