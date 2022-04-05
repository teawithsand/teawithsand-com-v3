import { blogHomePath, portfolioPath } from "@app/Component/endpoints"
import Code from "@app/Component/UI/Util/Code/Code"
import React from "react"
import { Link } from "react-router-dom"

import styles from "./aboutMe.scss?module"

export default () => {
    return <main className={styles.pageContainer}>
        <article>
            <header className={styles.header}>
                <h1>
                    About me
                </h1>
            </header>
            <div className={styles.pageContent}>
                <p>
                    My name is Przemysław Głowacki. I am young programming adept.
                </p>
                <p>
                    You may also want to check out my <Link to={portfolioPath}>portfolio</Link> and <Link to={blogHomePath}>blog</Link>.
                </p>
            </div>
        </article>
    </main>
}