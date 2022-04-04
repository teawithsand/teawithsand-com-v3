import posts from "@posts/Posts"

const entrypoint = async () => {
    let res = []
    for (const p of posts) {
        res.push({
            ...p,
            component: await p.component,
        })
    }

    console.log({ res })
}

entrypoint()