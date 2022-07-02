import { stat } from "fs"
import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { MPlayerSource } from "@app/domain/bfr/source"
import { useWTPSelector } from "@app/domain/redux/store"
import { WTPSourceType } from "@app/domain/wtp/source"

import { claimId, NS_REACT_QUERY } from "tws-common/misc/GlobalIDManager"
import { useQuery } from "tws-common/react/hook/query"

const List = styled.ul``

const ListElement = styled.li``

const NoElements = styled.div``

const formatSource = (s: MPlayerSource) => {
	if (s.whatToPlaySource.type === WTPSourceType.BLOB_SOURCE) {
		return s.whatToPlaySource.fileName
	} else if (s.whatToPlaySource.type === WTPSourceType.URL_SOURCE) {
		return s.whatToPlaySource.url
	} else if (s.whatToPlaySource.type === WTPSourceType.ABOOK_FILE_SOURCE) {
		return "File with id: " + s.whatToPlaySource.sourceId
	}
}

const PlayerEntryList = () => {
	const state = useWTPSelector(s => s.state)

	const { data: playlistData, id } = state

	if (playlistData.type === "error") {
		return <NoElements>An error occurred</NoElements>
	} else if (playlistData.type === "no-sources") {
		return <NoElements>Playlist not set</NoElements>
	} else if (playlistData.type === "loading") {
		return <NoElements>Loading</NoElements>
	} else {
		return (
			<List>
				{playlistData.bfrPlaylist.sources.map((s, i) => {
					return <ListElement key={i}>{formatSource(s)}</ListElement>
				})}
			</List>
		)
	}
}

export default PlayerEntryList
