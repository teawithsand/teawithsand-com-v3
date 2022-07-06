import { ImageDataLike } from "gatsby-plugin-image"
import React, { useContext, useRef } from "react"
import styled, { css } from "styled-components"

import ShrineViewArticleDisplay from "@app/components/shrine/view/ShrineViewArticleDisplay"
import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button } from "tws-common/ui"
import TagLine from "tws-common/ui/TagLine"

type ViewProps = {
	$isSmall: boolean
}

const ArticleSection = styled.section`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1rem;
`

const ArticleTitle = styled.h1``
const ArticleSubtitle = styled.span.attrs<ViewProps>({
	className: "text-muted",
})<ViewProps>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	row-gap: 0;
	column-gap: 1rem;

	${({ $isSmall }) =>
		$isSmall &&
		css`
			align-items: center;
			justify-content: center;
			text-align: center;
		`}
`

const ArticleSubtitleEntry = styled.span``

const ArticleHeader = styled.header<ViewProps>`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	grid-template-rows: minmax(0, auto);
	gap: 0.5rem;

	${({ $isSmall }) =>
		$isSmall &&
		css`
			align-items: center;
			justify-content: center;
			text-align: center;
		`}
`

const ArticleNavigationEntry = styled(Button)``

const ArticleNavigation = styled.nav<ViewProps>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem;

	${({ $isSmall }) =>
		$isSmall &&
		css`
			align-items: center;
			justify-content: center;
			text-align: center;
		`}
`

const ArticleTagLineContainer = styled.span<ViewProps>`
	display: block;
	${({ $isSmall }) =>
		$isSmall &&
		css`
			margin-left: auto;
			margin-right: auto;
		`}
`

// eslint-disable-next-line react/display-name
const ShrineViewArticleSection = React.forwardRef(
	(
		props: {
			title: string
			tags: string[]
			contentHTML: string
			heroImage: ImageDataLike | null
			createdAt: Date
			lastEditedAt: Date | null
			imagesScrollElement: React.RefObject<HTMLElement | null>
			commentsScrollElement: React.RefObject<HTMLElement | null>
			mapScrollElement: React.RefObject<HTMLElement | null>
		},
		ref,
	) => {
		const {
			title,
			tags,
			heroImage,
			createdAt,
			lastEditedAt,
			imagesScrollElement,
			commentsScrollElement,
			mapScrollElement,
			contentHTML,
		} = props

		const trans = useAppTranslationSelector(s => s.shrine.view)

		const descriptionScrollElement = useRef<HTMLElement | null>(null)

		const scrollToElement = (
			e: HTMLElement | null | undefined,
			location?: "center" | "start",
		) => {
			if (e) {
				e.scrollIntoView({
					block: location ?? "center",
					behavior: "smooth",
				})
			}
		}

		const { isSmall } = useContext(ShrineViewContext)

		return (
			<ArticleSection ref={ref as any}>
				<ArticleHeader $isSmall={isSmall}>
					<ArticleTitle>{title}</ArticleTitle>
					<ArticleSubtitle $isSmall={isSmall}>
						<ArticleSubtitleEntry>
							{trans.createdAt(createdAt)}
						</ArticleSubtitleEntry>
						{lastEditedAt && (
							<ArticleSubtitleEntry>
								{trans.lastEditedAt(lastEditedAt)}
							</ArticleSubtitleEntry>
						)}
					</ArticleSubtitle>
					<ArticleTagLineContainer $isSmall={isSmall}>
						<TagLine
							tags={tags.map(tag => ({
								name: "#" + tag,
								onClick: () => {
									// noop
								},
							}))}
						/>
					</ArticleTagLineContainer>
					<ArticleNavigation $isSmall={isSmall}>
						<ArticleNavigationEntry
							variant="primary"
							onClick={() =>
								scrollToElement(imagesScrollElement.current)
							}
						>
							{trans.navigation.images}
						</ArticleNavigationEntry>
						<ArticleNavigationEntry
							variant="primary"
							onClick={() =>
								scrollToElement(commentsScrollElement.current)
							}
						>
							{trans.navigation.comments}
						</ArticleNavigationEntry>
						<ArticleNavigationEntry
							variant="primary"
							onClick={() =>
								scrollToElement(mapScrollElement.current)
							}
						>
							{trans.navigation.map}
						</ArticleNavigationEntry>
						<ArticleNavigationEntry
							variant="primary"
							onClick={() =>
								scrollToElement(
									descriptionScrollElement.current,
									"start",
								)
							}
						>
							Opis
						</ArticleNavigationEntry>
					</ArticleNavigation>
				</ArticleHeader>

				<ShrineViewArticleDisplay
					ref={descriptionScrollElement}
					heroImage={heroImage}
					html={contentHTML}
				/>
			</ArticleSection>
		)
	},
)

export default ShrineViewArticleSection
