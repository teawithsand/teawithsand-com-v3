import React, { useLayoutEffect, useRef } from "react"

import highlight from "highlight.js"
import 'highlight.js/styles/github.css'
import javascript from 'highlight.js/lib/languages/javascript'
import php from 'highlight.js/lib/languages/php'
import go from 'highlight.js/lib/languages/go'
import scss from 'highlight.js/lib/languages/scss'
import css from 'highlight.js/lib/languages/css'

highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('css', css)
highlight.registerLanguage('scss', scss)
highlight.registerLanguage('go', go)
highlight.registerLanguage('php', php)

export type CodeProps = {
    language: string,
    mayNotWrap?: boolean,
    children: string | string[],
    code?: undefined,
} | {
    language: string,
    mayNotWrap?: boolean,
    code: string,
    children?: undefined,
}

export default (props: CodeProps) => {
    const elemRef = useRef<any>()
    let value = props.children ?? props.code
    if (value instanceof Array && value !== null) {
        value = value.join("\n")
    }

    if (typeof value === "string") {
        value = value.trim()
    }

    const highlighted = highlight.highlight(value as string, {
        language: props.language,
    }).value

    return <pre ref={elemRef} className={`language-${props.language}`}><code dangerouslySetInnerHTML={{__html: highlighted}}></code></pre>
}