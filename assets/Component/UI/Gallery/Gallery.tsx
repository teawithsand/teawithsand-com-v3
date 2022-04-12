import { AutonomusGallery as AutonomousGallery, Item } from "another-react-gallery"
import React, { useMemo } from "react"

import "another-react-gallery/scss/style.scss";
import { ResponsiveImage } from "@app/util/image/responsive";

export type GalleryImage = {
    source: ResponsiveImage,
    title?: string,
}

export default (props: {
    images: GalleryImage[],
}) => {
    const { images } = props

    const items: Item[] = useMemo(() => {
        return images.map(img => ({
            type: "image",
            key: img.source.src,
            source: {
                type: "srcset",
                srcSet: img.source.srcSet,
            },
            title: img.title,
            alt: img.title ?? "img",
        }))
    }, [images])

    return <AutonomousGallery
        className="gallery-sized-container"
        items={items}
        showFullscreen={true}
        showZoomToggle={true}
    />

}