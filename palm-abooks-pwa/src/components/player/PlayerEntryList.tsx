import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import {
	MPlayerSource,
	MPlayerSourceMetadataType,
} from "@app/domain/bfr/source"
import { useBFRSelector, useWTPSelector } from "@app/domain/redux/store"
import { WTPSourceType } from "@app/domain/wtp/source"

import { formatDurationSeconds } from "tws-common/lang/time/format"
import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { setCurrentSourceIndex } from "tws-common/player/bfr/actions"
import Metadata, {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "tws-common/player/metadata/Metadata"

const List = styled.ul``

const ListElement = styled.li``

const NoElements = styled.div``

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/player-entry-list")

const formatSourceName = (
	s: MPlayerSource,
	metadata: Metadata | null,
	i: number,
) => {
	if (s.metadata.type === MPlayerSourceMetadataType.ABOOK_FILE) {
		return s.metadata.abookFileMetadata.fileName ?? `File no. ${i + 1}`
	}

	if (s.whatToPlaySource.type === WTPSourceType.BLOB_SOURCE) {
		return s.whatToPlaySource.fileName
	} else if (s.whatToPlaySource.type === WTPSourceType.URL_SOURCE) {
		return s.whatToPlaySource.url
	} else if (s.whatToPlaySource.type === WTPSourceType.ABOOK_FILE_SOURCE) {
		LOG.error(LOG_TAG, "Got WTP source with not matching metadata type", s)
		return "File with id: " + s.whatToPlaySource.sourceId
	}
}

const formatSourceDuration = (metadata: Metadata | null) => {
	if (metadata?.duration) return formatDurationSeconds(metadata.duration)
	return null
}

const SourceRender = (props: {
	source: MPlayerSource
	metadata: Metadata | null
	index: number
	active: boolean
}) => {
	const { source, metadata, index, active } = props

	const inner = (
		<>
			{formatSourceName(source, metadata, index)} -{" "}
			{formatSourceDuration(metadata)}
		</>
	)

	const dispatch = useDispatch()

	const onClick = () => {
		dispatch(setCurrentSourceIndex(index))
	}

	if (active) {
		return (
			<ListElement onClick={onClick}>
				<b>{inner}</b>
			</ListElement>
		)
	} else {
		return <ListElement onClick={onClick}>{inner}</ListElement>
	}
}
const successOrNull = (r: MetadataLoadingResult | null) => {
	if (!r) return null
	if (r.type === MetadataLoadingResultType.OK) {
		return r.metadata
	}
	return null
}

const PlayerEntryList = () => {
	const state = useWTPSelector(s => s.state)
	const metadataBag = useBFRSelector(s => s.metadataState.data)
	const currentSourceIndex = useBFRSelector(
		s => s.playerConfig.currentSourceIndex,
	)

	// TODO(teawithsand): looks like this element is rendered each time state changes, not metadata bag
	//  which is bad
	//  it should be fixed

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
				{playlistData.bfrPlaylist.sources.map((s, i) => (
					<SourceRender
						key={s.id}
						index={i}
						metadata={successOrNull(metadataBag.getResult(i))}
						source={s}
						active={i === currentSourceIndex}
					/>
				))}
			</List>
		)
	}
}

export default PlayerEntryList
