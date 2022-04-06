package render

import (
	"context"
	"encoding/json"

	"github.com/BurntSushi/toml"
	"github.com/teawithsand/twsblog/render/compile"
	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/cfg"
	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/scripting"
	"github.com/teawithsand/twsblog/util/typescript"
	"go.uber.org/dig"
	"gopkg.in/yaml.v2"
)

func Run() (err error) {
	/*
			{
			c := compile.PostContent{
				Imports: []typescript.Import{
					typescript.Import{
						From:    "react",
						Default: "react",
						Others:  []string{"useEffect"},
					},
				},
				Entries: []compile.PostContentEntry{
					{
						Type:    "asdf",
						Tag:     "fdsa",
						Content: "asdf",
						Props: map[string]string{
							"prop": "ok",
						},
					},
				},
			}

			res, err := yaml.Marshal(c)
			if err != nil {
				panic(err)
			}
			fmt.Println(string(res))

		}
	*/

	ctx := context.Background()

	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}

	loader := compile.DefaultLoader{
		Loader: &fsutil.DataLoader{
			Parsers: []fsutil.DataParser{
				{
					Parser:    json.Unmarshal,
					Extension: "json",
				},
				{
					Parser:    toml.Unmarshal,
					Extension: "toml",
				},
				{
					Parser:    yaml.Unmarshal,
					Extension: "yaml",
				},
				{
					Parser:    yaml.Unmarshal,
					Extension: "yml",
				},
			},
		},
	}

	input := &compile.DefaultLoaderInput{
		TargetFS: &fsutil.PrefixFS{
			Wrapped:    &fsutil.LocalFS{},
			PathPrefix: config.SourcePath,
		},
	}
	globalOutput := &compile.DefaultRendererOutput{
		TargetFS: &fsutil.PrefixFS{
			Wrapped:    &fsutil.LocalFS{},
			PathPrefix: config.EmitPath,
		},
	}

	postOutput := func(meta compile.PostMetadata) compile.RendererOutput {
		return &compile.DefaultRendererOutput{
			TargetFS: &fsutil.PrefixFS{
				Wrapped:    globalOutput.TargetFS,
				PathPrefix: meta.DirName,
			},
		}
	}

	rawPosts, err := loader.Load(ctx, input)
	if err != nil {
		return
	}

	processor := compile.DefaultProcessor{
		PostFSPicker: func(raw compile.RawPost, meta compile.PostMetadata) fsutil.FS {
			return postOutput(meta).FS()
		},
	}
	posts := util.MapIterator(rawPosts, func(ctx context.Context, data compile.RawPost) (res compile.Post, err error) {
		return processor.Process(ctx, data)
	})

	metadata := util.MapIterator(posts, func(ctx context.Context, data compile.Post) (res compile.PostMetadata, err error) {
		res = data.PostMetadata
		return
	})

	fullPostData := util.MapIterator(posts, func(ctx context.Context, data compile.Post) (res compile.FullPostData, err error) {
		mt := data.PostMetadata
		res = compile.FullPostData{
			Post: data,
			ExportedPostMetadata: compile.ExportedPostMetadata{
				Slug:         mt.Slug,
				Path:         mt.Path,
				Title:        mt.Title,
				Tags:         mt.Tags,
				CreatedAt:    mt.CreatedAt,
				LastEditedAt: mt.LastEditedAt,
				UnstableID:   mt.UnstableID,
			},
		}
		return
	})

	exportedMetadata := util.MapIterator(fullPostData, func(ctx context.Context, data compile.FullPostData) (compile.ExportedPostMetadata, error) {
		return data.ExportedPostMetadata, nil
	})

	c := dig.New()
	err = c.Provide(func() (res util.Iterator[compile.Post], err error) {
		res = posts
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res util.Iterator[compile.PostMetadata], err error) {
		res = metadata
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res util.Iterator[compile.ExportedPostMetadata], err error) {
		res = exportedMetadata
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res util.Iterator[compile.FullPostData], err error) {
		res = fullPostData
		return
	})
	if err != nil {
		return
	}

	err = globalOutput.FS().RemoveAll("/")
	if err != nil {
		return
	}

	err = globalOutput.FS().Mkdir("/")
	if err != nil {
		return
	}

	err = c.Invoke(func(posts util.Iterator[compile.Post]) (err error) {
		return posts.Iterate(ctx, util.Receiver[compile.Post](func(ctx context.Context, data compile.Post) (err error) {
			err = data.DstFs.Mkdir("/")
			return
		}))
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(metadata util.Iterator[compile.FullPostData]) (err error) {
		renderer := compile.JSONRenderer[compile.ExportedPostMetadata]{
			FileName: "metadata.json",
		}
		return metadata.Iterate(ctx, util.Receiver[compile.FullPostData](func(ctx context.Context, data compile.FullPostData) (err error) {

			err = renderer.Render(ctx, data.ExportedPostMetadata, &compile.DefaultRendererOutput{
				TargetFS: data.Post.DstFs,
			})
			return
		}))
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(it util.Iterator[compile.ExportedPostMetadata]) (err error) {
		renderer := compile.FuseIndexRenderer[compile.ExportedPostMetadata]{
			FuseIndexOutputPath: "fuseIndex.json",
			Scripts: &scripting.Collection{
				Dir: config.ScriptsPath,
			},
			FuseScriptName: "fuse_index.js",
		}
		metadata, err := util.CollectIterator(ctx, it)
		if err != nil {
			return
		}
		err = renderer.Render(ctx, metadata, globalOutput)
		return
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(it util.Iterator[compile.Post]) (err error) {
		renderer := compile.CopyRenderer{
			SourcePath:      "assets",
			DestinationPath: "assets",
		}
		err = it.Iterate(ctx, util.Receiver[compile.Post](func(ctx context.Context, data compile.Post) (err error) {
			err = renderer.Render(ctx, data.SrcFs, &compile.DefaultRendererOutput{
				TargetFS: data.DstFs,
			})
			return
		}))
		if err != nil {
			return
		}

		return
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(it util.Iterator[compile.ExportedPostMetadata]) (err error) {
		renderer := compile.JSONRenderer[[]compile.ExportedPostMetadata]{
			FileName: "completeIndex.json",
		}
		entries, err := util.CollectIterator(ctx, it)
		if err != nil {
			return
		}
		err = renderer.Render(ctx, entries, globalOutput)
		if err != nil {
			return
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(it util.Iterator[compile.Post]) (err error) {
		renderer := compile.TSPostRenderer{
			TargetPath: "Post.tsx",
			BaseImports: []typescript.Import{
				{
					From:    "react",
					Default: "React",
				},
			},
		}

		err = it.Iterate(ctx, util.Receiver[compile.Post](func(ctx context.Context, post compile.Post) (err error) {
			err = renderer.Render(ctx, post, &compile.DefaultRendererOutput{
				TargetFS: post.DstFs,
			})
			return
		}))
		return
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(it util.Iterator[compile.Post]) (err error) {
		renderer := compile.TSIndexRenderer{
			TargetPath:       "posts.tsx",
			PostMetadataFile: "metadata.json",
			ComponentFile:    "Post",
		}

		err = renderer.Render(ctx, it, globalOutput)
		return
	})
	if err != nil {
		return
	}

	return
}
