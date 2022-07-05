import React from "react"
import styled from "styled-components"

import { ShrineViewSectionHeader } from "@app/components/shrine/view/ShrineViewSection"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

const CommentsSection = styled.section``
const CommentsSectionHeader = ShrineViewSectionHeader

// eslint-disable-next-line react/display-name
const ShrineViewCommentsSection = React.forwardRef((props: {}, ref) => {
	const trans = useAppTranslationSelector(s => s.shrine.view)

	return (
		<CommentsSection ref={ref as any}>
			<CommentsSectionHeader>
				<h3>{trans.commentsHeader}</h3>
			</CommentsSectionHeader>

			<p>Comments are niy for now</p>
		</CommentsSection>
	)
})

export default ShrineViewCommentsSection
