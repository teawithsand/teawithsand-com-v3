package compile

import (
	"context"
	"encoding/json"
	"log"

	"github.com/BurntSushi/toml"
	"github.com/teawithsand/twsblog/compile/process"
	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/cfg"
	"github.com/teawithsand/twsblog/util/scripting"
)

// Compiles all assets, so that webpack is able to build blog.
func Run() (err error) {
	ctx := context.Background()

	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}

	loader := process.DefaultLoader{
		Loader: &scripting.DataLoader{
			Parsers: []scripting.DataParser{
				{
					Parser:    json.Unmarshal,
					Extension: "json",
				},
				{
					Parser:    toml.Unmarshal,
					Extension: "toml",
				},
			},
		},
		Dir: config.SourcePath,
	}

	var rawPosts []process.RawPost

	log.Println("Running loading...")

	err = loader.LoadPostsDir(ctx, util.Receiver[process.RawPost](func(ctx context.Context, res process.RawPost) (err error) {
		rawPosts = append(rawPosts, res)
		return
	}))
	if err != nil {
		return
	}

	var posts []process.Post

	processor := process.DefaultProcessor{}

	log.Println("Running processing...")
	for _, raw := range rawPosts {
		var post process.Post
		post, err = processor.Process(ctx, raw)
		if err != nil {
			return
		}

		posts = append(posts, post)
	}

	log.Println("Running rendering...")
	renderer := process.DefaultRenderer{
		TargetDir: config.EmitPath,
		Scripts: &scripting.Collection{
			Dir: config.ScriptsPath,
		},
	}

	err = renderer.RenderPosts(ctx, posts)
	if err != nil {
		return
	}

	log.Println("Posts rendered OK")

	return
}
