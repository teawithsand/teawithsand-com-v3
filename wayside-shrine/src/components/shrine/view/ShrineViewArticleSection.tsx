import React from "react"
import styled, { css } from "styled-components"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import {
	BREAKPOINT_LG,
	BREAKPOINT_MD,
	breakpointIndex,
	useBreakpointIndex,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { Button } from "tws-common/ui"
import TagLine from "tws-common/ui/TagLine"

type ViewProps = {
	$isSmall: boolean
}

const ArticleNavigationEntry = styled(Button)``

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

const ArticleContainer = styled.div``

const ArticleSection = styled.section`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1rem;
`

// eslint-disable-next-line react/display-name
const ShrineViewArticleSection = React.forwardRef(
	(
		props: {
			title: string
			tags: string[]
			contentHTML: string
			imagesScrollElement: React.RefObject<HTMLElement | null>
			commentsScrollElement: React.RefObject<HTMLElement | null>
			mapScrollElement: React.RefObject<HTMLElement | null>
		},
		ref,
	) => {
		const {
			title,
			tags,
			imagesScrollElement,
			commentsScrollElement,
			mapScrollElement,
			contentHTML,
		} = props

		const trans = useAppTranslationSelector(s => s.shrine.view)

		const isSmall =
			useBreakpointIndex(breakpointIndex(BREAKPOINT_LG)) <
			breakpointIndex(BREAKPOINT_MD)

		const scrollToElement = (e: HTMLElement | null | undefined) => {
			if (e) {
				e.scrollIntoView({
					block: "center",
					behavior: "smooth",
				})
			}
		}

		return (
			<ArticleSection ref={ref as any}>
				<ArticleHeader $isSmall={isSmall}>
					<h1>{title}</h1>
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
					</ArticleNavigation>
				</ArticleHeader>

				<ArticleContainer
					dangerouslySetInnerHTML={{
						__html: contentHTML,
					}}
				></ArticleContainer>
			</ArticleSection>
		)
	},
)

export default ShrineViewArticleSection
