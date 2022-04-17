/*
Copyright © 2022 teawithsand <teawithsand@gmail.com>
*/
package main

import (
	"embed"
	"io/fs"

	"github.com/teawithsand/twsblog/cmd"
	"github.com/teawithsand/twsblog/serve"
)

//go:embed __dist/*
var Assets embed.FS

func main() {
	subbed, err := fs.Sub(Assets, serve.AssetsPrefix)
	if err != nil {
		panic(err)
	}
	serve.StrippedPrefixAssets = subbed
	serve.EmbeddedAssets = Assets
	cmd.Execute()
}
