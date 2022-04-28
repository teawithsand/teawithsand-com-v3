import LoadingSpinner from "@app/Component/UI/Util/Loading/LoadingSpinner"
import React, { Suspense } from "react"

export type PostSource = () => Promise<{ default: React.ComponentType<any> }>

import styles from "./post.scss?module"

export const makePostComponent = (options: {
    source: PostSource
}) => {
    const { source } = options
    const PageComponent = React.lazy(() => source())

    const PageWrapperComponent = () => {
        return <Suspense fallback={<LoadingSpinner />}>
            <main className={styles.post}>
                <article>
                    <PageComponent />
                </article>
            </main>
        </Suspense>
    }

    return PageWrapperComponent
}