import ImageUtil from "@app/util/react/image/ImageUtil"
import React, { useRef } from "react"
import { Link } from "react-router-dom"

import styles from "./home.scss?module"

import phoneImage from "@app/images/svgrepo/phone.svg"
import emailImage from "@app/images/svgrepo/email.svg"
import TeaAnimation from "@app/Component/TeaAnimation/TeaAnimation"
import { blogPostListPath, portfolioPath } from "@app/Component/endponts"

export default () => {
    const firstSectionRef = useRef<HTMLElement>()

    return <main className={styles["page-container"]}>
        <article className={styles.header}>
            <div className={styles.header__background}>
                <TeaAnimation />
            </div>
            <div className={styles.header__overlay}>
                <h1>
                    Teawithsand's website
                </h1>
                <p>
                    Some notes, utils, blog and portfolio.
                    Everyting that simple programmer needs in single webpack project.
                </p>
                <button className={styles["header__scroll-button"]} onClick={() => {
                    firstSectionRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }}>
                    See more
                </button>
            </div>
        </article>
        <article className={styles["about-website"]} ref={firstSectionRef}>
            <h2>
                About this website
            </h2>
            <p>
                Lorem ipsum
            </p>
        </article>
        <article className={styles.features}>
            <div className={styles["features__card-container"]}>
                <div className={styles.features__feature}>
                    <h3>
                        Blog
                    </h3>
                    <p>
                        Blog consists of programming contents in {">"}90%.
                        You have been warned.
                    </p>
                    <Link className={styles.features__btn} to={blogPostListPath}>
                        See posts
                    </Link>
                </div>
                <div className={styles.features__feature}>
                    <h3>
                        Portfolio
                    </h3>
                    <p>
                        Summary of projects that I've created, along with other useful links.
                    </p>
                    <Link className={styles.features__btn} to={portfolioPath}>
                        See portfolio
                    </Link>
                </div>
            </div>
        </article>
        <article className={styles.contact}>
            <div>
                <header>
                    <h3>
                        Contact
                    </h3>
                    <p>
                        Via email or phone(but I prefer email).
                    </p>
                </header>
                <div className={styles.contact__container}>
                    <div className={styles.contact__phone}>
                        <div>
                            <a href={`tel:retractedretracted`}>
                                <ImageUtil
                                    src={phoneImage}
                                />
                            </a>
                        </div>
                        <div>
                            <a href={`tel:retractedretracted`}>
                                retracted retracted
                            </a>
                        </div>

                    </div>
                    <div className={styles.contact__email}>
                        <div>
                            <a href={`mailto:contact@przemyslawglowacki.com`}>
                                <ImageUtil
                                    src={emailImage}
                                />
                            </a>
                        </div>
                        <div>
                            <a href={`mailto:contact@przemyslawglowacki.com`}>
                                contact@przemyslawglowacki.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </main>
}