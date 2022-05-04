import React, { useMemo, useState } from "react"

import * as styles from "./gallery.module.scss"
import { DissolveGalleryDisplay } from "@app/components/gallery/GalleryDisplay"
import GalleryItemProvider from "@app/components/gallery/ItemProvider"
import GalleryItemDisplay from "@app/components/gallery/GalleryItemDisplay"
import classnames from "@app/util/lang/classnames"
import { useFullscreen } from "@app/util/react/hook/useFullscreen"

import { useGesture } from "@use-gesture/react"

export type GalleryProps = {
	provider: GalleryItemProvider
	autoSwitchInitializer?: () => number
}

const defaultAutoSwitchDelay = 30 * 1000

const Gallery = (props: GalleryProps) => {
	const { provider, autoSwitchInitializer } = props

	const [itemIndex, setItemIndex] = useState<number>(0)
	const [showBottomBar, setShowBottomBar] = useState<boolean>(true)

	const [autoSwitchDelay, setAutoSwitchDelay] = useState(
		autoSwitchInitializer ?? defaultAutoSwitchDelay
	)

	const fsc = useFullscreen({})

	const showControls = provider.itemCount > 1
	const hideIfNotShowControlsStyle = showControls ? {} : { display: "none" }


	const currentItem = useMemo(
		() =>
			provider.provideItem(itemIndex, "main", {}),
		[itemIndex, provider]
	)

	const hiddenItems = useMemo(() => {
		const items = []
		for (let i = 0; i < provider.itemCount; i++) {
			items.push(
				provider.provideItem(i, "main-hidden", {})
			)
		}
		return items
	}, [provider])

	const thumbnails = useMemo(() => {
		const items = []
		for (let i = 0; i < provider.itemCount; i++) {
			items.push(
				provider.provideItem(i, "thumbnail", {})
			)
		}
		return items
	}, [provider])

	const onBottomBarTap = (i: number) => {
		while (i < 0) {
			i += provider.itemCount
		}
		setItemIndex(i % provider.itemCount)
	}

	const onRightSideTap = () => {
		onBottomBarTap(itemIndex + 1)
	}

	const onLeftSideTap = () => {
		onBottomBarTap(itemIndex - 1)
	}

	/*
	useEffect(() => {
		if (autoSwitchDelay > 0) {
			const interval = setInterval(() => {
				onRightSideTap()
			}, autoSwitchDelay)

			return () => {
				clearInterval(interval)
			}
		}
	}, [autoSwitchDelay])
	*/

	const bind = useGesture(
		{
			onDrag: ({
				xy: [x, y],
				initial: [sx, sy],
				swipe: [swx, swy],
				intentional,
				first,
				last,
				memo,
				tap,
			}) => {
				if (intentional) {
					if (tap) {
						if (!fsc.isFullscreen) {
							fsc.enter()
						}
						setShowBottomBar(false)
					} else if (swy === 0 && swx !== 0) {
						if (swx < 0) onRightSideTap()
						else onLeftSideTap()
					} else {
						if (swx === 0 && swy !== 0) {
							if (swy < 0) {
								setShowBottomBar(true)
							} else {
								setShowBottomBar(false)
							}
						}
					}
				}
			},

			// TODO(teawithsand): entering zoom/full mode on pinch
			onPinch: () => {
				return
			},
		},
		{
			drag: {
				filterTaps: false,
				preventDefault: true,
			},
			pinch: {},
		}
	) as unknown as () => unknown

	return (
		<div
			className={classnames(
				styles.gallery,
				fsc.isFullscreen ? styles.galleryFullscreen : null,
				!showBottomBar ? styles.galleryBottomBarHidden : null
			)}
		>
			<div className={styles.topBar}>
				<div className={styles.topBarCounter}>
					{itemIndex + 1}/{provider.itemCount}
				</div>
				<div
					className={classnames(
						styles.topBarAutoSwitchProgress,
						autoSwitchDelay > 0
							? styles.topBarAutoSwitchProgressEnabled
							: styles.topBarAutoSwitchProgressDisabled
					)}
					onAnimationIteration={() => {
						onRightSideTap()
					}}
					style={{
						["--progress-animation-duration" as any]: `${autoSwitchDelay}ms`,
					}}
				></div>
				<div className={styles.topBarOptions}>
					<button
						className={styles.topBarOptionsBtn}
						onClick={() => {
							fsc.setFullscreen(!fsc.isFullscreen)
						}}
					>
						{!fsc.isFullscreen ? "FULLSCREEN" : "EXIT FULLSCREEN"}
					</button>
					<button
						className={styles.topBarOptionsBtn}
						onClick={() => {
							setShowBottomBar(!showBottomBar)
						}}
					>
						{showBottomBar ? "HIDE BOTTOM BAR" : "SHOW BOTTOM BAR"}
					</button>
					<button
						className={styles.topBarOptionsBtn}
						onClick={() => {
							if (autoSwitchDelay > 0) {
								setAutoSwitchDelay(-1)
							} else {
								setAutoSwitchDelay(defaultAutoSwitchDelay)
							}
						}}
					>
						{autoSwitchDelay > 0
							? "DISABLE AUTO SWITCH"
							: "ENABLE AUTO SWITCH"}
					</button>
				</div>
			</div>
			<div className={styles.mainBar}>
				<div
					className={styles.mainBarLeftOverlay}
					style={{ ...hideIfNotShowControlsStyle }}
					onClick={() => onLeftSideTap()}
				></div>

				<div
					className={styles.mainBarDisplayedEntryWrapper}
					{...bind()}
				>
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
					style={{ ...hideIfNotShowControlsStyle }}
					onClick={() => onRightSideTap()}
				></div>
			</div>
			<div
				className={classnames(
					styles.bottomBar,
					showControls ? styles.bottomBarClickable : null,
					!showBottomBar ? styles.bottomBarHidden : null
				)}
			>
				{thumbnails.map((img, i) => (
					// Quick note about that div:
					//  It's required, since it makes chrome and firefox behave the same way
					//  when it comes to displaying overflowing images with fixed width and/or height
					//  if that is not done, object-fit: contain will work on ff,
					//  but it won't on chrome
					//  it's like that, because chrome and ff differently understand specification
					//  for css height parameter with percentage value
					//
					// I've spent too much time debugging it, so this div stays here.
					<div
						key={img.key}
						className={classnames(
							styles.bottomBarEntryWrapper,
							i === itemIndex
								? styles.bottomBarEntryWrapperActive
								: null
						)}
						onClick={() => onBottomBarTap(i)}
					>
						<GalleryItemDisplay isBottomBar={true} item={img} />
					</div>
				))}
			</div>
		</div>
	)
}

export default Gallery
