import React from "react"
import { GalleryItem } from "@app/components/gallery/GalleryItem"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import * as styles from "./galleryDisplay.module.scss"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"
import GalleryItemDisplay from "@app/components/gallery/GalleryItemDisplay"



/**
 * Main display of gallery ie. the main screen, which contains image, video or something else.
 * Handles transitions between items.
 */
type GalleryDisplay = React.FC<{ item: GalleryItem }>

export default GalleryDisplay

const dissolveClasses = findTransitionClasses("dissolve", styles)
export const DissolveGalleryDisplay: GalleryDisplay = ({ item }) => {
	return (
		<TransitionGroup className={styles.overlapContainer}>
			<CSSTransition timeout={5000} classNames={dissolveClasses} key={item.key}>
				<GalleryItemDisplay item={item} />
			</CSSTransition>
		</TransitionGroup>
	)
}
