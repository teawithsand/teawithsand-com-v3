import * as React from "react"

import style from "./footer.scss?module"

export default () => {
    return <footer className={style.footer}>
        <hr></hr>
        <div className={style.footer__left}>
            
        </div>
        <div className={style.footer__right}>
            By Teawithsand 2022 - echo date('Y');
        </div>
    </footer>
}