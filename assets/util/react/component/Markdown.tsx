import * as marked from "marked"
import React, { useMemo } from "react"
export const Markdown = (props: {
    markdown: string,
    className?: string,
}) => {
    const { markdown, className } = props

    const html = useMemo(() => marked.marked(markdown, {
        xhtml: true,
    }), [markdown])

    console.log({ html, markdown })

    return <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}>
    </div>
}