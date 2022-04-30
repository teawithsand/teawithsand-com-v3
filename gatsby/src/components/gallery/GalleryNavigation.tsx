import { GalleryItem } from "@app/components/gallery/GalleryItem"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

export type GalleryMode = "normal" | "fullscreen" | "zoom"

export default interface GalleryNavigation {
	readonly currentItems: StickySubscribable<GalleryItem>
	readonly currentMode: StickySubscribable<GalleryMode>

	onSwipe(direction: "left" | "right" | "top" | "bottom"): void
	onLeftSideTap(): void
	onRightSideTap(): void
	onScreenTap(): void
	onBottomPanelTap(): void
}
