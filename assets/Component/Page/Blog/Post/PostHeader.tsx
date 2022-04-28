import { formatTime } from "@app/util/lang/date"
import React from "react"

export interface PostMetadata {
    title: string,
    createdAt: string,
    lastEditedAt: string | null,
    path: string,
    tags?: null | string[],
}

import styles from "./post.scss?module"

export default (props: {
    metadata: PostMetadata,
}) => {
    const { metadata } = props
    const { title, createdAt, lastEditedAt, tags } = metadata

    return <header className={styles.postHeader}>
        <h1 className={styles.postHeaderTitle}>{title}</h1>
        <div className={styles.postHeaderCreatedAt}>Created: {formatTime(createdAt)}</div>
        {lastEditedAt ? <div className={styles.postHeaderLastEditedAt}>Edited: {formatTime(lastEditedAt)}</div> : null}
        <div className={styles.postHeaderTags}>Tags: {((tags ?? []).length > 0 ? (tags ?? []) : ["No tags"]).join(" ")}</div>
        <hr></hr>
    </header>
}