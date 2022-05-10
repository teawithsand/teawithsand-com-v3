import { Link } from "gatsby"
import { graphql, useStaticQuery } from "gatsby"
import { getImage } from "gatsby-plugin-image"
import React, { useMemo } from "react"
import { Collapse } from "react-bootstrap"

import Gallery from "@app/components/gallery/Gallery"
import { ArrayGalleryItemProvider } from "@app/components/gallery/ItemProvider"
import {
	galleryPath,
	homePath,
	linkGithub,
	paintPath,
} from "@app/components/paths"
import Palmabooks2LatestAPK from "@app/static/palmabooks2_latest.apk"
import classnames from "@app/util/lang/classnames"
import { useNamedToggle } from "@app/util/react/hook/toggleHook"

import * as styles from "./portfolio.module.scss"

const palmabooksComArchiveOrgLink =
	"https://web.archive.org/web/20180307161225/https://palmabooks.com/"
const torutCratesIOLink = "https://crates.io/crates/torut"
const teawithsandComV1GithubLink =
	"https://github.com/teawithsand/teawithsand-com-v1"
const teawithsandComV2GithubLink =
	"https://github.com/teawithsand/teawithsand-com-v2"

// TODO(teawithsand): fix display on phone devices using media breakpoints

export default () => {
	const query = useStaticQuery(graphql`
		query {
			teawithsandComV1: allFile(
				filter: { relativePath: { glob: "teawithsandComV1/*" } }
			) {
				nodes {
					id
					childImageSharp {
						gatsbyImageData
					}
				}
			}

			palmabooks: allFile(
				filter: { relativePath: { glob: "palmabooks/*" } }
			) {
				nodes {
					id
					childImageSharp {
						gatsbyImageData
					}
				}
			}
		}
	`)

	const palmabooksImagesProvider = useMemo(
		() =>
			new ArrayGalleryItemProvider(
				query.palmabooks.nodes
					.map((i: any) => ({
						key: i.id,
						image: getImage(i.childImageSharp),
					}))
					.map((i: any) => ({
						type: "fluid-image",
						key: i.key,
						image: i.image,
						alt: i.key,
					})),
			),
		[],
	)

	const teawithsandComV1ImagesProvider = useMemo(
		() =>
			new ArrayGalleryItemProvider(
				query.teawithsandComV1.nodes
					.map((i: any) => ({
						key: i.id,
						image: getImage(i.childImageSharp),
					}))
					.map((i: any) => ({
						type: "fluid-image",
						key: i.key,
						image: i.image,
						alt: i.key,
					})),
			),
		[],
	)

	const othersToggle = useNamedToggle()
	const palmabooksComToggle = useNamedToggle()
	const palmabooksABookToggle = useNamedToggle()
	const teawithsandComV12Toggle = useNamedToggle()
	const teawithsandComV3Toggle = useNamedToggle()

	return (
		<article className={styles.pageContainer}>
			<header className={styles.header}>
				<h1>Portfolio</h1>
				<p>
					Portfolio consists of list of projects that I have created.
					It contains only major projects, lots of other minor ones
					are available on my <a href={linkGithub}>github</a>.
				</p>
			</header>
			<div className={styles.features}>
				<div
					className={classnames(
						styles.feature,
						teawithsandComV3Toggle.toggled
							? styles.featureActive
							: null,
					)}
				>
					<div className={styles.featureHeader}>
						<h2 className={styles.featureHeaderTitle}>
							teawithsand.com v3 website
						</h2>
						<button
							onClick={() => teawithsandComV3Toggle.toggle()}
							className={styles.featureHeaderButton}
						>
							{teawithsandComV3Toggle.toggled
								? "Show less"
								: "Show more"}
						</button>
						<p className={styles.featureHeaderSubtitle}>
							2022.03 - now <br /> It's this website. It
							implements things like{" "}
							<Link to={paintPath}>
								simple vector-graphics paint(new features are in
								development)
							</Link>{" "}
							and <Link to={homePath}>homepage animation</Link>{" "}
							and more
							<br />
							<a href="https://github.com/teawithsand/teawithsand-com-v3">
								See code on github
							</a>
						</p>
					</div>
					<Collapse in={teawithsandComV3Toggle.toggled}>
						<div className={styles.featureContent}>
							<p>
								Aside from being a portfolio, it's also my blog
								and a few utils. In the past it used my simple
								static site generator{" "}
								<a href="https://github.com/teawithsand/handmd">
									handmd
								</a>{" "}
								Now it runs on gatsby.
							</p>
							<p>
								Technologies used: TypeScript, Webpack, SASS,
								Gatsby, React
							</p>
							<p>
								<Link
									className={styles.downloadButton}
									to={paintPath}
								>
									Go to paint
								</Link>
							</p>
							<p>
								<Link
									className={styles.downloadButton}
									to={homePath}
								>
									Go to home page
								</Link>
							</p>
							<p>
								<Link
									className={styles.downloadButton}
									to={galleryPath}
								>
									Go to gallery example
								</Link>
							</p>
							<p>
								<a
									className={styles.downloadButton}
									href="https://github.com/teawithsand/teawithsand-com-v3"
								>
									See source code on github
								</a>
							</p>
						</div>
					</Collapse>
				</div>

				<div
					className={classnames(
						styles.feature,
						teawithsandComV12Toggle.toggled
							? styles.featureActive
							: null,
					)}
				>
					<div className={styles.featureHeader}>
						<h2 className={styles.featureHeaderTitle}>
							teawithsand.com v1 and v2
						</h2>
						<button
							onClick={() => teawithsandComV12Toggle.toggle()}
							className={styles.featureHeaderButton}
						>
							{teawithsandComV12Toggle.toggled
								? "Show less"
								: "Show more"}
						</button>
						<p className={styles.featureHeaderSubtitle}>
							2022.01 - 2022.03 <br />
							Past versions of this website with backend and
							different features <br />
							Code available on github
							<br />
							Screenshots available
						</p>
					</div>
					<Collapse in={teawithsandComV12Toggle.toggled}>
						<div className={styles.featureContent}>
							<p>
								Previous versions of teawithsand.com website.
								They both implement lots of features and simple
								app for learning languages called Langka.
							</p>
							Both projects were somewhat similar and implemented.
							On backend side:
							<ul>
								<li>
									REST(like) API and SPA, with axios as HTTP
									client
								</li>
								<li>
									User login with password reset , email
									confirmation, captcha checking and other
									user-related features
								</li>
								<li>
									Simple foreign languages learning app called
									langka
								</li>
							</ul>
							On frontend side:
							<ul>
								<li>React + webpack project</li>
								<li>Redux for global state management</li>
								<li>i18n-react for managing translations</li>
							</ul>
							<p>
								Technologies used in V1: PHP, Symfony 6,
								PostgreSQL, TypeScript, Webpack, SASS
								<br />
								Technologies used in V2: Go, MongoDB,
								TypeScript, Webpack, SASS
							</p>
							<p>
								<a
									href={teawithsandComV1GithubLink}
									className={styles.downloadButton}
								>
									See version one code on github
								</a>
								<br />
								<br />
								<a
									href={teawithsandComV2GithubLink}
									className={styles.downloadButton}
								>
									See version two code on github
								</a>
								<br />
								<br />
								Small note here: I have removed commit history,
								since it contained some secrets and I didn't
								really wanted to cleanup git repo. It would not
								contain them if I have known that I will be
								publishing it by the time.
							</p>
							<h3>
								Screenshots of version one(created on dev
								environment with dummy data):
							</h3>
							<Gallery
								provider={teawithsandComV1ImagesProvider}
							/>
						</div>
					</Collapse>
				</div>

				<div
					className={classnames(
						styles.feature,
						palmabooksABookToggle.toggled
							? styles.featureActive
							: null,
					)}
				>
					<div className={styles.featureHeader}>
						<h2 className={styles.featureHeaderTitle}>
							PalmABooks / PalmABooks2 ABook player
						</h2>
						<button
							onClick={() => palmabooksABookToggle.toggle()}
							className={styles.featureHeaderButton}
						>
							{palmabooksABookToggle.toggled
								? "Show less"
								: "Show more"}
						</button>
						<p className={styles.featureHeaderSubtitle}>
							2017.03 - 2019.01
							<br />
							Screenshots available <br />
							<a
								href={Palmabooks2LatestAPK}
								download="palmabooks2_latest.apk"
							>
								Download last released APK file
							</a>
						</p>
					</div>
					<Collapse in={palmabooksABookToggle.toggled}>
						<div className={styles.featureContent}>
							<p>
								Quick note here: PalmABooks was the first ABook
								player. PalmABooks2 uses most of the codebase
								and general ideas from previous version.
								Consider PalmABooks 2 newer version of the same
								app.
								<br />
								<br />
								PalmABooks 2 is native android ABook players
								written java and kotlin(since at the beginning
								of development, kotlin was not official android
								programming language). Both are not maintained
								anymore and do not work on latest Android
								versions, which was the reason why they were
								removed from Google Play.
							</p>
							<p>
								PalmABooks2 also had small Spring Boot backend,
								which scrapped{" "}
								<a
									target="_blank"
									href="https://librivox.org/api/info"
								>
									librivox
								</a>{" "}
								and{" "}
								<a
									href="https://wolnelektury.pl/api/"
									target="_blank"
								>
									wolnelektury.pl
								</a>{" "}
								APIs, stored data in PostgreSQL and exposed
								simple REST API, which android app could query
								for free ABooks.
							</p>
							<p>
								2nd version implemented lot's of features like:
							</p>
							<ul>
								<li>
									Integration with backend API and simple UI
									to query it
								</li>
								<li>
									Sleep functionality - automatic pause after
									chosen period of time, also pause that
									slowly turns down volume until it reaches
									actual pause
								</li>
								<li>Sleep reset, once user shakes device</li>
								<li>
									Changing playback speed - between x0.5 and
									x4
								</li>
								<li>
									Saving position in book - after you close
									app and open again it will start playing at
									position that was saved before exit app,
									every book's position is tracked
									independently
								</li>
								<li>
									Configurable buttons, they might change file
									or jump by 5s up to 10m
								</li>
								<li>
									Bookmarks - simple notes with position in
									book
								</li>
								<li>
									Configurable sorting of sound files -
									support for filenames like 1.mp3, 2.mp3...
									10.mp3 in proper order
								</li>
								<li>Widget</li>
								<li>
									Support for .mp3, .m4a, .wmv, .wav, .ogg,
									.m4b files
								</li>
							</ul>
							<p>
								Technologies used in android app: Android SDK,
								Kotlin, Java Technologies used on the backend:
								Spring Boot, hibernate, PostgreSQL
							</p>
							<p>
								<a
									className={styles.downloadButton}
									href={Palmabooks2LatestAPK}
									download="palmabooks2_latest.apk"
								>
									Download palmabooks2_latest.apk
								</a>
							</p>
							<h3>Screenshots</h3>
							<Gallery provider={palmabooksImagesProvider} />
						</div>
					</Collapse>
				</div>

				<div
					className={classnames(
						styles.feature,
						palmabooksComToggle.toggled
							? styles.featureActive
							: null,
					)}
				>
					<div className={styles.featureHeader}>
						<h2 className={styles.featureHeaderTitle}>
							palmabooks.com website
						</h2>
						<button
							onClick={() => palmabooksComToggle.toggle()}
							className={styles.featureHeaderButton}
						>
							{palmabooksComToggle.toggled
								? "Show less"
								: "Show more"}
						</button>
						<p className={styles.featureHeaderSubtitle}>
							2018.02 - 2018.09
							<br />
							Available at{" "}
							<a href={palmabooksComArchiveOrgLink}>
								archive.org
							</a>
						</p>
					</div>
					<Collapse in={palmabooksComToggle.toggled}>
						<div className={styles.featureContent}>
							<p>
								Note: this project is not the one, which powered
								PalmABooks2 application.
							</p>
							<p>
								palmabooks.com was website, which aggregated
								blog posts about books using RSS feeds, which
								are generated automatically by most blogging
								software.
							</p>
							<p>It implemented features like:</p>
							<ul>
								<li>
									User login / registration in classical email
									+ password way.
								</li>
								<li>Login via facebook.</li>
								<li>
									Basic user management routines: changing
									email, changing password, resetting
									forgotten password and deleting account.
								</li>
								<li>
									Tracking and graying-out already clicked
									blog posts
								</li>
								<li>Favorite blog list</li>
								<li>List of blog posts from favorite blogs</li>
								<li>
									Rating blog posts using stars(from 1 to 5).
								</li>
								<li>
									some management features, which allowed
									administrator to hide all posts or single
									post from given blog or to manually trigger
									RSS scrapping of specified blog.
								</li>
							</ul>
							<p>
								Technologies used: PHP, Symfony, JavaScript,
								jQuery, Bootstrap, PostgreSQL
							</p>
							<p>
								<a
									className={styles.downloadButton}
									href={palmabooksComArchiveOrgLink}
								>
									See at archive.org
								</a>
							</p>
						</div>
					</Collapse>
				</div>

				<div
					className={classnames(
						styles.feature,
						othersToggle.toggled ? styles.featureActive : null,
					)}
				>
					<div className={styles.featureHeader}>
						<h2 className={styles.featureHeaderTitle}>
							Other projects
						</h2>
						<button
							onClick={() => othersToggle.toggle()}
							className={styles.featureHeaderButton}
						>
							{othersToggle.toggled ? "Show less" : "Show more"}
						</button>
						<p className={styles.featureHeaderSubtitle}>
							Like <a href={torutCratesIOLink}>torut</a> <br />
							Available at my <a href={linkGithub}>github</a>
						</p>
					</div>
					<Collapse in={othersToggle.toggled}>
						<div className={styles.featureContent}>
							<p>
								I've created lots of OSS projects, but only one
								of them got some wide spread attention:{" "}
								<a href={torutCratesIOLink}>torut</a>. At the
								moment of writing this text, it has more than
								48k downloads on{" "}
								<a href="https://crates.io">crates.io</a>
							</p>
						</div>
					</Collapse>
				</div>
			</div>
		</article>
	)
}
