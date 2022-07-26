import { Link } from "gatsby"
import React, { CSSProperties } from "react"
import styled from "styled-components"

const PostEntryTags = styled.div`
	display: flex;
	flex-flow: row wrap;
	row-gap: 0.4rem;
	column-gap: 0.8rem;
`

const SmallTagList = (props: {
	tags: string[]
	style?: CSSProperties
	className?: string
	tagPathPicker?: (tag: string) => string
}) => {
	const { tagPathPicker } = props
	if (tagPathPicker) {
		return (
			<PostEntryTags style={props.style} className={props.className}>
				{props.tags.map((v, i) => (
					<Link
						className="link-secondary"
						to={tagPathPicker(v)}
						key={i}
					>
						#{v}
					</Link>
				))}
			</PostEntryTags>
		)
	} else {
		return (
			<PostEntryTags style={props.style} className={props.className}>
				{props.tags.map((v, i) => (
					<span key={i}>#{v}</span>
				))}
			</PostEntryTags>
		)
	}
}

export default SmallTagList
