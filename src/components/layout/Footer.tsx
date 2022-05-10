import * as React from "react"

import * as style from "./footer.module.scss"

import { icons } from "feather-icons"
import { linkGithub, linkLinkedIn } from "@app/components/paths"

const Footer = () => {
	return (
		<footer className={style.footer}>
			<hr></hr>
			<div className={style.footerLeft}>
				<a
					href={linkGithub}
					title="Github"
				>
					<img
						src={`data:image/svg+xml;utf8,${icons.github.toSvg()}`}
						alt="Github"
					/>
				</a>
				<a
					href={linkLinkedIn}
					title="LinkedIn"
				>
					<img
						src={`data:image/svg+xml;utf8,${icons.linkedin.toSvg()}`}
						alt="LinkedIn"
					/>
				</a>
			</div>
			<div className={style.footerRight}>
				By Teawithsand 2022 - echo date('Y');
			</div>
		</footer>
	)
}

export default Footer