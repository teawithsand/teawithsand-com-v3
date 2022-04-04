#!/usr/bin/env node
const fuse = require("fuse.js")
const fs = require("fs")


const data = fs.readFileSync(0, 'utf-8');
const parsed = JSON.parse(data)

/*
const parsed = {
    fields: ["title"],
    data: [
        {
            "title": "some title",
        },
        {
            "title": "other title",
        }
    ]
}
*/

const fields = process.argv.slice(2)
const index = fuse.createIndex(fields, parsed)

process.stdout.write(JSON.stringify(index))