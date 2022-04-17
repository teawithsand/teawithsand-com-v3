package serve

import (
	"embed"
	"io/fs"
)

const AssetsPrefix = "__dist"

var EmbeddedAssets embed.FS
var StrippedPrefixAssets fs.FS
