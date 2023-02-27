import {
	GatsbyImage,
	getImage,
	IGatsbyImageData,
	ImageDataLike,
} from "gatsby-plugin-image"
import React, { useMemo } from "react"
import styled from "styled-components"

import { ShrineViewSectionHeader } from "@app/components/shrine/view/ShrineViewSection"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { AutonomousGallery } from "tws-common/react/components/gallery"

const GallerySection = styled.section``
const GallerySectionHeader = ShrineViewSectionHeader

// eslint-disable-next-line react/display-name
const ShrineViewGallerySection = React.forwardRef(
	(props: { images: ImageDataLike[] }, ref) => {
		const { images } = props
		const loadedImages: IGatsbyImageData[] = useMemo(
			// ts can't understand filter, so I have to
			() =>
				images
					.map(img => getImage(img))
					.filter(img => !!img) as IGatsbyImageData[],
			[images],
		)

		const trans = useAppTranslationSelector(s => s.shrine.view)

		return (
			<GallerySection ref={ref as any}>
				<GallerySectionHeader>
					<h3>{trans.galleryHeader}</h3>
				</GallerySectionHeader>
				<AutonomousGallery
					size="medium"
					enableKeyboardControls={true}
					entries={loadedImages.map((img, i) => ({
						mainDisplay: (
							<GatsbyImage
								key={i}
								alt=""
								image={img}
								objectFit="contain"
							/>
						),
					}))}
				/>
			</GallerySection>
		)
	},
)

export default ShrineViewGallerySection
