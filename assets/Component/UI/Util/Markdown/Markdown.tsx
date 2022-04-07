import classnames from "@app/util/lang/classnames"
import * as marked from "marked"
import React, { useMemo } from "react"

import styles from "./markdown.scss?module"

export default (props: {
    children: string | string[],
    className?: string,
}) => {
    const { children, className } = props

    const makeMarkdown = () => {
        if (typeof children === "string") {
            return children
        } else if (children instanceof Array) {
            return children.join("\n")
        } else {
            throw new Error(`Unknown children: ${children}`)
        }
    }

    const html = useMemo(() => marked.marked(makeMarkdown(), {
        xhtml: true,
    }), [children])

    return <div
        className={classnames(styles.markdown, className)}
        dangerouslySetInnerHTML={{ __html: html }}>
    </div>
}