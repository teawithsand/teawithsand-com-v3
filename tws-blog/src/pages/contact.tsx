import PageContainer from "@app/components/layout/PageContainer"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import * as React from "react"
import { githubLink, linkedInLink, twitterLink } from "tws-common/misc/social"

const ContactPage = () => {
	const trans = useAppTranslationSelector(s => s.contact)
	const info = useAppTranslationSelector(s => s.info)
	return (
		<PageContainer>
			<h1>{trans.title}</h1>
			<p>{trans.text}</p>
			<ul>
				<li>
					<a href={`mailto:${info.email}`}>
						{trans.email} {info.email}
					</a>
				</li>
				<li>
					<a href={twitterLink(info.twitter)}>{trans.twitter}</a>
				</li>
				<li>
					<a href={linkedInLink(info.linkedIn)}>{trans.linkedIn}</a>
				</li>
				<li>
					<a href={githubLink(info.github)}>{trans.github}</a>
				</li>
			</ul>
		</PageContainer>
	)
}

export default ContactPage
