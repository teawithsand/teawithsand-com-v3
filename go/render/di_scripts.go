package render

import (
	"github.com/teawithsand/handmd/util/scripting"
	"go.uber.org/dig"
)

const FuseIndexScript = `#!/usr/bin/env node
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

process.stdout.write(JSON.stringify(index))`

const PrerenderScript = `#!/usr/bin/env node

const prerender = require('prerender');
const server = prerender();
server.start();`

type CommandFactory scripting.CommandFactory

func RegisterCommandInDI(c *dig.Container) (err error) {
	err = c.Provide(func(cleaner Cleaner) (res CommandFactory, err error) {
		/*
			commandFac := &scripting.InMemoryCommandFactory{
				Scripts: scripting.InMemoryScripts{
					"fuse_index.js": scripting.InMemoryScript{
						Script: FuseIndexScript,
					},
					"prerender.js": scripting.InMemoryScript{
						Script: PrerenderScript,
					},
				},
			}
			err = commandFac.Initialize()
			if err != nil {
				return
			}

			type wrapper struct {
				CommandFactory
				ScriptsCWD string
			}

			func (w *wrapper) GetCommand(ctx context.Context, name string) (cmd *scripting.Command, err error) {
				cmd, err = w.CommandFactory.GetCommand(ctx, name)
				if err != nil {
					return
				}

				cmd.Dir = w.ScriptsCWD

				cmd.Stderr = os.Stderr
				return
			}
		*/

		commandFac := &scripting.FSCommandFactory{
			// HACK(teawithsand): it should be provided from config
			Dir: "/workspaces/tws_blog/utilscripts",
		}

		// cleaner.Register(commandFac)

		res = commandFac
		return
	})
	if err != nil {
		return
	}
	return
}
