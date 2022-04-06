import React, { useLayoutEffect, useMemo, useRef } from "react"

import highlight from "highlight.js"
import 'highlight.js/styles/github.css'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import html from 'highlight.js/lib/languages/html'
import rust from 'highlight.js/lib/languages/rust'
import php from 'highlight.js/lib/languages/php'
import go from 'highlight.js/lib/languages/go'
import scss from 'highlight.js/lib/languages/scss'
import css from 'highlight.js/lib/languages/css'

highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('typescript', typescript)
highlight.registerLanguage('python', python)
highlight.registerLanguage('css', css)
highlight.registerLanguage('scss', scss)
highlight.registerLanguage('go', go)
highlight.registerLanguage('php', php)
highlight.registerLanguage('rust', rust)
highlight.registerLanguage('html', html)

export type CodeProps = {
    language: string,
    mayWrap?: boolean,
    children: string | string[],
    code?: undefined,
} | {
    language: string,
    mayWrap?: boolean,
    code: string,
    children?: undefined,
}

export default (props: CodeProps) => {
    const highlighted = useMemo(() => {
        let value = props.children ?? props.code
        if (value instanceof Array && value !== null) {
            value = value.join("\n")
        }

        if (typeof value === "string") {
            value = value.trim()
        }

        return highlight.highlight(value as string, {
            language: props.language,
        }).value
    }, [props.children, props.code])

    return <pre className={`language-${props.language}`}><code dangerouslySetInnerHTML={{ __html: highlighted }}></code></pre>
}