package compile

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/teawithsand/twsblog/compile/process"
	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/cfg"
	"github.com/teawithsand/twsblog/util/scripting"
	"gopkg.in/yaml.v2"
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
		MetadataLoader: &scripting.DataLoader{
			Parsers: []scripting.DataParser{
				{
					Parser:    json.Unmarshal,
					Extension: "json",
				},
				{
					Parser:    toml.Unmarshal,
					Extension: "toml",
				},
				{
					Parser:    yaml.UnmarshalStrict,
					Extension: "yaml",
				},
				{
					Parser:    yaml.UnmarshalStrict,
					Extension: "yml",
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
	err = runRenderers(ctx, config, posts)
	if err != nil {
		return
	}
	log.Println("Posts rendered OK")

	return
}

func runRenderers(ctx context.Context, config Config, posts []process.Post) (err error) {
	emitPath := config.EmitPath
	var metas []process.PostMetadata
	for _, p := range posts {
		metas = append(metas, p.PostMetadata)
	}

	cleanup := process.CleanupRenderer{
		TargetDir: emitPath,
	}
	err = cleanup.Render(ctx, nil)
	if err != nil {
		return
	}

	pdp := func(ctx context.Context, i int, metadata process.PostMetadata) (dir string, err error) {
		dir = fmt.Sprintf("post_%d", i)
		return
	}

	copy := process.CopyRenderer{
		PostDirPicker: pdp,
		TargetPath:    emitPath,
	}

	err = copy.Render(ctx, posts)
	if err != nil {
		return
	}

	ts := process.TSIndexRenderer{
		TargetPath:    emitPath,
		PostDirPicker: pdp,
	}

	err = ts.Render(ctx, metas)
	if err != nil {
		return
	}

	metadata := process.MetadataRenderer{
		TargetPath:    emitPath,
		PostDirPicker: pdp,
	}

	err = metadata.Render(ctx, metas)
	if err != nil {
		return
	}

	index := process.IndexRenderer{
		CombinedMetadataOutputPath: path.Join(emitPath, "combinedMetadata.json"),
		FuseIndexOutputPath:        path.Join(emitPath, "fuseIndex.json"),

		FuseScriptName: "fuse_index",
		Scripts: &scripting.Collection{
			Dir: config.ScriptsPath,
		},
	}

	err = index.Render(ctx, metas)
	if err != nil {
		return
	}

	post := process.TSPostRenderer{
		TargetPath:    emitPath,
		PostDirPicker: pdp,
		TagImporter: func(tag string) (string, error) {
			return "@pc/" + tag, nil
		},
	}

	err = post.Render(ctx, posts)
	if err != nil {
		return
	}

	return
}
