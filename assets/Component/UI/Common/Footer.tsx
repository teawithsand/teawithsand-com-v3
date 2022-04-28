import * as React from "react"

import style from "./footer.scss?module"

import { icons } from "feather-icons"
import { linkGithub, linkLinkedIn } from "@app/Component/endpoints"

export default () => {

    return <footer className={style.footer}>
        <hr></hr>
        <div className={style.footer__left}>
            <a href={linkGithub} title="Github" className={style.footer_icon}>
                <img src={`data:image/svg+xml;utf8,${icons.github.toSvg()}`} alt="Github" />
            </a>
            <a href={linkLinkedIn} title="LinkedIn" className={style.footer_icon}>
                <img src={`data:image/svg+xml;utf8,${icons.linkedin.toSvg()}`} alt="LinkedIn" />
            </a>
        </div>
        <div className={style.footer__right}>
            By Teawithsand 2022 - echo date('Y');
        </div>
    </footer>
}