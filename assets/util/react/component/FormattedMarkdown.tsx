import { MessageDescriptor, useIntl } from "react-intl";
import { Markdown } from "./Markdown";
import React from "react"

export default (props: MessageDescriptor) => {
    const intl = useIntl()
    return <Markdown
        markdown={intl.formatMessage(props)}
    />
}