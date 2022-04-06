import React, { useState } from "react"

import styles from "./postList.scss?module"

import posts from "@app/generated/posts"

interface PostMetadata {
    title: string,
    unstableId: string,
    createdAt: string,
}

interface PostSummaryData {
    metadata: PostMetadata,
}

const formatDate = (date: string): string => {
    const parsed = new Date(date)
    return parsed.toLocaleDateString("pl-PL")
}

const PostSummary = (props: {
    post: PostSummaryData,
}) => {
    const { post } = props
    const { metadata } = post
    return <div className={styles.postSummary}>
        <h2 className={styles.postSummaryTitle}>{metadata.title}</h2>
        <span className={styles.postSummaryCreatedAt}>Created at: {formatDate(metadata.createdAt)}</span>
        <span className={styles.postSummaryTags}>Created at: {formatDate(metadata.createdAt)}</span>
    </div>
}

export default () => {
    const [currentPosts, setCurrentPosts] = useState(posts)


    return <main className={styles.pageContainer}>
        <section>
            <header className={styles.header}>
                <h1>Total posts: {currentPosts.length}</h1>
            </header>
            <div className={styles.postSummaryList}>
                {
                    [
                        ...currentPosts,
                        ...currentPosts,
                        ...currentPosts,
                    ].map((p) => <PostSummary key={p.metadata.unstableId} post={p} />)
                }
            </div>
        </section>
    </main>

}