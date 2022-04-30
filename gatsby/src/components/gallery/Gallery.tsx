import React, { useMemo } from "react"

import GalleryNavigation, {
	GalleryMode,
} from "@app/components/gallery/GalleryNavigation"

import * as styles from "./gallery.module.scss"
import { DissolveGalleryDisplay } from "@app/components/gallery/GalleryDisplay"
import GalleryItemProvider from "@app/components/gallery/ItemProvider"
import GalleryItemDisplay from "@app/components/gallery/GalleryItemDisplay"
import classnames from "@app/util/lang/classnames"

export type GalleryProps = {
	itemProvider: GalleryItemProvider
	mode: GalleryMode
	itemIndex: number
	navigation?: GalleryNavigation
}

const Gallery = (props: GalleryProps) => {
	const { itemIndex, itemProvider, mode, navigation } = props
	const currentItem = useMemo(
		() =>
			itemProvider.provideItem(itemIndex, "main", {
				mode,
			}),
		[mode, itemIndex, itemProvider]
	)

	const hiddenItems = useMemo(() => {
		const items = []
		for (let i = 0; i < itemProvider.itemCount; i++) {
			items.push(
				itemProvider.provideItem(i, "main", {
					mode: "normal",
				})
			)
		}
		return items
	}, [mode, itemIndex, itemProvider])

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

	const showControls = !!navigation

	const maybeHideStyle = showControls ? {} : { display: "none" }

	return (
		<div className={classnames(styles.gallery, styles.gallerySmall)}>
			<div className={styles.mainBar}>
				<div
					className={styles.mainBarLeftOverlay}
					style={{ ...maybeHideStyle }}
				>
				</div>

				<div className={styles.mainBarDisplayedEntryWrapper}>
					<DissolveGalleryDisplay item={currentItem} />
				</div>

				{
					// Another trick here: load all elements to DOM
					// with visibility: hidden
					// so parent container gets it's size from children
					// then it won't change when there are children with different sizes
				}
				<div className={styles.mainBarHiddenElements}>
					{hiddenItems.map(i => (
						<GalleryItemDisplay key={i.key} item={i} />
					))}
				</div>

				<div
					className={styles.mainBarRightOverlay}
					style={{ ...maybeHideStyle }}
				>
				</div>
			</div>
			<div className={styles.bottomBar}>
				{thumbnails.map(i => (
					// Quick note about that div:
					//  It's required, since it makes chrome and firefox behave the same way
					//  when it comes to displaying overflowing images with fixed width and/or height
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
