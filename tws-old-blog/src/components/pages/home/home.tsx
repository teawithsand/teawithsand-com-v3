import loadable from "@loadable/component"
import { Link } from "gatsby"
import React, { useRef } from "react"

import {
	blogHomePath,
	contactPath,
	email,
	galleryPath,
	linkEmail,
	paintPath,
	portfolioPath,
} from "@app/components/paths"

import * as styles from "./home.module.scss"
import EmailImage from "./email.svg"

const TeaAnimation = loadable(
	() => import("@app/components/tea-animation/TeaAnimation"),
)

const Home = () => {
	const firstSectionRef = useRef<HTMLElement | null>(null)

	return (
		<main>
			<article className={styles.header}>
				<div className={styles.headerBackground}>
					<TeaAnimation />
				</div>
				<div className={styles.headerOverlay}>
					<h1>Teawithsand's website</h1>
					<p>
						Some notes, utils, blog and portfolio on single website.
					</p>
					<button
						className={styles.headerScrollButton}
						onClick={() => {
							if (firstSectionRef.current) {
								firstSectionRef.current.scrollIntoView({
									behavior: "smooth",
									block: "start",
								})
							}
						}}
					>
						See more
					</button>
				</div>
			</article>
			<article className={styles.aboutWebsite} ref={firstSectionRef}>
				<h2>About this website</h2>
				<p>
					It's my blog and website, where I can experiment with stuff,
					without unnecessary development overhead. It also implements
					some utils that I'd like to have.
				</p>
			</article>
			<article className={styles.features}>
				<div className={styles.featuresCardContainer}>
					<div className={styles.featuresFeature}>
						<h3>Blog</h3>
						<p>
							Blog consists of programming contents in {">"}90%.
							You have been warned.
						</p>
						<Link className={styles.featuresBtn} to={blogHomePath}>
							See posts
						</Link>
					</div>
					<div className={styles.featuresFeature}>
						<h3>Portfolio</h3>
						<p>
							Summary of projects that I've created, along with
							other useful links.
						</p>
						<Link className={styles.featuresBtn} to={portfolioPath}>
							See portfolio
						</Link>
					</div>
					<div className={styles.featuresFeature}>
						<h3>Gallery</h3>
						<p>
							Simple, but extendable gallery for showing images,
							with support for gestures
						</p>
						<Link className={styles.featuresBtn} to={galleryPath}>
							Go to gallery
						</Link>
					</div>
					<div className={styles.featuresFeature}>
						<h3>Paint</h3>
						<p>Simple SVG paint, for drawing some sketches</p>
						<Link className={styles.featuresBtn} to={paintPath}>
							Go to paint
						</Link>
					</div>
				</div>
			</article>
			<article className={styles.contact}>
				<div>
					<header>
						<h3>
							<Link to={contactPath}>Contact</Link>
						</h3>
						<p>Via email</p>
					</header>
					<div className={styles.contactContainer}>
						<div>
							<div>
								<a href={linkEmail}>
									<EmailImage width={100} height={100} />
								</a>
							</div>
							<div>
								<a href={linkEmail}>{email}</a>
							</div>
						</div>
					</div>
				</div>
			</article>
		</main>
	)
}

export default Home
