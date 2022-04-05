import { email, linkEmail, linkGithub, linkLinkedIn, linkYouTube } from "@app/Component/endponts"
import React from "react"

import styles from "./contact.scss?module"

export default () => {
    return <main className={styles.pageContainer}>
        <article>
            <header className={styles.header}>
                <h1>Contact</h1>
            </header>

            <div className={styles.pageBody}>
                You can contact me via:
                <ul>
                    <li>Email <a href={linkEmail}>{email}</a></li>
                </ul>
                You can also find me at:
                <ul>
                    <li><a href={linkGithub}>GitHub</a></li>
                    <li><a href={linkLinkedIn}>LinkedIn</a></li>
                    <li><a href={linkYouTube}>YouTube</a></li>
                </ul>
            </div>
        </article>
    </main>
}