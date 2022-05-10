import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import { GalleryItem } from "@app/components/gallery/GalleryItem"
import GalleryItemDisplay from "@app/components/gallery/GalleryItemDisplay"
import classnames from "@app/util/lang/classnames"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"

import * as galleryStyles from "./gallery.module.scss"
import * as styles from "./galleryDisplay.module.scss"

/**
 * Main display of gallery ie. the main screen, which contains image, video or something else.
 * Handles transitions between items.
 */
type GalleryDisplay = React.FC<{ item: GalleryItem }>

export default GalleryDisplay

const dissolveClasses = findTransitionClasses("dissolve", styles)
export const DissolveGalleryDisplay: GalleryDisplay = ({ item }) => {
	return (
		<TransitionGroup className={classnames(styles.elementsContainer)}>
			<CSSTransition
				timeout={300}
				classNames={dissolveClasses}
				key={item.key}
			>
				<GalleryItemDisplay isBottomBar={false} item={item} />
			</CSSTransition>
		</TransitionGroup>
	)
}
