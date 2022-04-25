import localForage from "localforage";

export const paintStorage = localForage.config({
    name: "dom-paint",
    description: "DOM paint's storage for things like CTRL+Z and storing current picture",
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
    storeName: "dom-paint",
})