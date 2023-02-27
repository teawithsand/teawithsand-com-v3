import { tagPath } from "@app/paths"
import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"

const PostEntryTags = styled.div`
	display: flex;
	flex-flow: row wrap;
	row-gap: 0.4rem;
	column-gap: 0.8rem;
`

// TODO(teawithsand): instead use smallTagLine form tws-common
const SmallTagList = (props: {
	tags: string[]
	style?: React.CSSProperties
	className?: string
}) => {
	return (
		<PostEntryTags style={props.style} className={props.className}>
			{props.tags.map((v, i) => (
				<Link className="link-secondary" to={tagPath(v)} key={i}>
					#{v}
				</Link>
			))}
		</PostEntryTags>
	)
}

export default SmallTagList
