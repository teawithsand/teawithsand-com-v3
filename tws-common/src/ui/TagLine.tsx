import React from "react"
import { Button } from "react-bootstrap"
import styled from "styled-components"
import LinkContainer from "tws-common/ui/LinkContainer"

const NoTags = styled.span`
	margin-top: 0.8rem;
	margin-bottom: 0.8rem;
	color: #6c757d; // from bootstrap's text-muted
`

const Tags = styled.ul`
	list-style: none;
	margin-left: 0;
	padding-left: 0;

	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
`

const TagListEntry = styled.li`
	display: inline;
	font-size: 0.9rem;
	padding: 0.2rem 0.3rem;
`

const TagButton = styled(Button)``

export type TagsViewTag = (
	| {
			url: string
			onClick?: undefined
	  }
	| {
			url?: undefined
			onClick: () => void
	  }
) & {
	name: string
	title?: string | undefined
}

const TagLine = (props: { tags: TagsViewTag[] }) => {
	const { tags } = props

	if (tags.length === 0) {
		return <NoTags>No Tags</NoTags>
	}

	return (
		<Tags>
			{tags.map((t, i) => (
				<TagListEntry key={i} title={"title" in t ? t.title : t.name}>
					{t.onClick === undefined ? (
						<LinkContainer to={t.url}>
							<TagButton
								size="sm"
								variant="outline-secondary"
								href="#"
							>
								<>{t}</>
							</TagButton>
						</LinkContainer>
					) : (
						<TagButton
							size="sm"
							variant="outline-secondary"
							onClick={t.onClick}
						>
							<>{t.name}</>
						</TagButton>
					)}
				</TagListEntry>
			))}
		</Tags>
	)
}

export default TagLine
