import React, { useMemo, useState } from "react"
import Fuse from 'fuse.js'

import styles from "./postList.scss?module"

import fuseIndex from "@app/generated/fuseIndex.json"
import summaryIndex from "@app/generated/summaryIndex.json"
import { useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"

const ParsedFuseIndex = Fuse.parseIndex(fuseIndex)
const postsIndexes = [...Array(summaryIndex.length).keys()]
const fuse = new Fuse(postsIndexes, {
    isCaseSensitive: false,
    shouldSort: true,
    includeScore: true,
}, ParsedFuseIndex);

interface PostMetadata {
    title: string,
    unstableId: string,
    createdAt: string,
    lastEditedAt?: string,
    path: string,
    tags?: null | string[],
    partialContent: string,
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

    const { createdAt, tags, path, lastEditedAt, partialContent } = metadata

    return <div className={styles.postSummary}>
        <h2 className={styles.postSummaryTitle}><Link to={path}>{metadata.title}</Link></h2>
        <div className={styles.postSummaryCreatedAt}>Created: {formatDate(createdAt)}</div>
        {lastEditedAt ? <div className={styles.postSummaryLastEditedAt}>Edited: {formatDate(lastEditedAt)}</div> : null}
        <div className={styles.postSummaryTags}>Tags: {((tags ?? []).length > 0 ? tags : ["No tags"]).join(" ")}</div>
        <p className={styles.postSummaryContent}>
            <Link to={path}>{partialContent}</Link>
        </p>
    </div>
}

const sortScore = "score"
const sortAscCreatedAt = "+createdAt"
const sortDescCreatedAt = "-createdAt"
const sortAscTitle = "+title"
const sortDescTitle = "-title"

export default () => {
    const [params, setParams] = useSearchParams()

    const sort = (params.get("sort") || sortScore).trim()
    const query = (params.get("query") ?? "").trim()

    const paramsObject = {
        sort,
        query,
    }

    const displayPostIndexes = useMemo(() => {
        let indexes: number[] = postsIndexes

        if (query) {
            const fuseResults = fuse
                .search(query)
                .sort((a, b) => a.score - b.score)
                .map((v) => v.item)
            console.log({ fuseResults })
            indexes = fuseResults as number[]
        }

        let filteredPosts = indexes.map(i => ({
            metadata: summaryIndex[i],
        }))

        if (sort === sortAscCreatedAt) {
            filteredPosts = filteredPosts.sort((a, b) => (new Date(a.metadata.createdAt)).getTime() - (new Date(b.metadata.createdAt)).getTime())
        } else if (sort === sortDescCreatedAt) {
            filteredPosts = filteredPosts
                .sort((a, b) => (new Date(a.metadata.createdAt)).getTime() - (new Date(b.metadata.createdAt)).getTime())
                .reverse()
        } else if (sort === sortAscTitle) {
            filteredPosts = filteredPosts
                .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
        } else if (sort === sortDescTitle) {
            filteredPosts = filteredPosts
                .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))
                .reverse()
        }

        if (query === "" && sort === sortScore) {
            filteredPosts = filteredPosts
                .sort((a, b) => (new Date(a.metadata.createdAt)).getTime() - (new Date(b.metadata.createdAt)).getTime())
                .reverse()
        }

        return filteredPosts
    }, [query, sort])

    const [formData, setFormData] = useState(() => ({
        query,
        sort,
    }))

    return <main className={styles.pageContainer}>
        <section>
            <header className={styles.header}>
                <h1>Interactive post list</h1>
            </header>
            <form className={styles.searchForm} onSubmit={(e) => {
                e.preventDefault()

                return false
            }}>
                <div className={styles.searchFormInput}>
                    <label>
                        Filter
                    </label>
                    <input
                        type="text"
                        value={formData.query}
                        title="Find posts using keywords or text like: webpack"
                        placeholder="Find posts using keywords or text like: webpack"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                query: e.target.value,
                            })
                            setParams({
                                ...paramsObject,
                                query: e.target.value,
                            })
                        }} />
                </div>
                <div className={styles.searchFormInput}>
                    <label>
                        Sort
                    </label>
                    <select
                        value={formData.sort}
                        onChange={(e) => {
                            const value = e.target.value
                            setFormData({
                                ...formData,
                                sort: value,
                            })
                            setParams({
                                ...paramsObject,
                                sort: value,
                            })
                        }}
                    >
                        <option value={sortScore}>Best matching query</option>
                        <option value={sortAscCreatedAt}>Oldest</option>
                        <option value={sortDescCreatedAt}>Latest</option>
                        <option value={sortAscTitle}>Title ascending</option>
                        <option value={sortDescTitle}>Title descending</option>
                    </select>
                </div>
            </form>
            <div className={styles.subHeader}>
                <h2>Results: {displayPostIndexes.length}</h2>
            </div>
            <hr></hr>
            <div className={styles.postSummaryList}>
                {
                    displayPostIndexes
                        .map((p) => <PostSummary key={p.metadata.unstableId} post={p} />)
                }
            </div>
        </section>
    </main>

}