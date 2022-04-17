package render

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/gosimple/slug"
	"github.com/teawithsand/handmd/compile/loader"
	"github.com/teawithsand/handmd/compile/renderer"
	"github.com/teawithsand/handmd/util/encoding"
	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/handmd/util/nonce"
	"github.com/teawithsand/handmd/util/scripting"
	"github.com/teawithsand/handmd/util/tsrender"
	"github.com/teawithsand/twsblog/render/defines"
	"github.com/teawithsand/twsblog/util/cfg"
	"go.uber.org/dig"
	"gopkg.in/yaml.v2"
)

var JSONEncoderFactory = encoding.EncoderFactoryFunc(func(w io.Writer) encoding.Encoder {
	return json.NewEncoder(w)
})

func Run() (err error) {
	ctx := context.Background()

	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}
	c := dig.New()

	parentInput := &fsal.PrefixFS{
		Wrapped:    &fsal.LocalFS{},
		PathPrefix: config.SourcePath,
	}

	parentOutput := &fsal.PrefixFS{
		Wrapped:    &fsal.LocalFS{},
		PathPrefix: config.EmitPath,
	}

	dataLoader := fsal.DataLoader{
		Parsers: []fsal.DataParser{
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
			{
				Parser:    xml.Unmarshal,
				Extension: "xml",
			},
		},
	}

	unstableIdGenerator := nonce.HexGenerator{
		BytesLength: 16,
	}

	metadataLoader := loader.Config[any, defines.RawPostMetadata]{
		Loader: dataLoader,
		Factory: func() *defines.RawPostMetadata {
			return &defines.RawPostMetadata{}
		},
		FileName: "metadata",
	}

	contentLoader := loader.Config[any, defines.PostContent]{
		Loader: dataLoader,
		Factory: func() *defines.PostContent {
			return &defines.PostContent{}
		},
		FileName: "content",
	}

	endpointsLoader := loader.Config[any, defines.Endpoints]{
		Loader: dataLoader,
		Factory: func() *defines.Endpoints {
			return &defines.Endpoints{}
		},
		FileName: "endpoints",
	}

	c.Provide(func() (ep defines.Endpoints, err error) {
		return endpointsLoader.Load(ctx, nil, parentInput)
	})

	dirLoader := loader.Dir[any, defines.RawPost]{
		InnerLoader: loader.LoaderFunc[loader.DirWrapper[any], defines.RawPost](
			func(ctx context.Context, lctx loader.DirWrapper[any], input loader.LoaderInput) (output defines.RawPost, err error) {
				metadata, err := metadataLoader.Load(ctx, lctx, input)
				if err != nil {
					return
				}

				content, err := contentLoader.Load(ctx, lctx, input)
				if err != nil {
					return
				}

				output.SrcFS = input
				output.Dir = lctx.DirName
				output.Metadata = metadata
				output.Content = content
				return
			},
		),
	}

	err = c.Provide(func() (res iter.Iterable[defines.RawPost], err error) {
		res, err = dirLoader.Load(ctx, nil, parentInput)
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(raw iter.Iterable[defines.RawPost]) (res iter.Iterable[defines.Post], err error) {
		imm := iter.Map(raw, func(ctx context.Context, raw defines.RawPost) (res defines.Post, err error) {
			uid, err := unstableIdGenerator.GenerateNonce(ctx)
			if err != nil {
				return
			}
			res = defines.Post{
				Content: raw.Content,
				PostMetadata: defines.PostMetadata{
					UnstableID:   uid,
					Path:         "/posts/" + raw.Metadata.CreatedAt.Format("2006-02-01") + "/" + slug.Make(raw.Metadata.Title),
					Slug:         slug.Make(raw.Metadata.Title),
					Title:        raw.Metadata.Title,
					Tags:         raw.Metadata.Tags,
					CreatedAt:    raw.Metadata.CreatedAt,
					LastEditedAt: raw.Metadata.LastEditedAt,
					DirName:      raw.Dir,
				},
				SrcFS: raw.SrcFS,
			}
			return
		})

		collected, err := iter.Collect(ctx, imm)
		if err != nil {
			return
		}

		res = iter.Slice(collected)
		return
	})
	if err != nil {
		return
	}

	err = c.Invoke(func(eps defines.Endpoints, posts iter.Iterable[defines.Post]) (err error) {
		// 0. Clean/dirs renderer
		cleanRenderer := renderer.Clean{}

		// 1. Assets copy
		copyRenderer := renderer.Copy{
			SourcePath:      "/assets",
			DestinationPath: "/assets",
			Required:        false,
		}

		commandFactory := &scripting.FSCommandFactory{
			Dir: config.ScriptsPath,
		}

		tsComponentRenderer := renderer.TSComponent{
			FileName: "Post.tsx",
			BaseImports: []tsrender.Import{
				{
					From:    "react",
					Default: "React",
				},
				{
					From:    "@app/Component/UI/Util/Markdown/Markdown",
					Default: "Markdown",
				},
				{
					From:    "@app/Component/Page/Blog/Post/PostHeader",
					Default: "PostHeader",
				},
				{
					From:    "@app/Component/Page/Blog/Post/PostFooter",
					Default: "PostFooter",
				},
				{
					From:    "./summaryMetadata.json",
					Default: "summaryMetadata",
				},
			},
		}

		postMetadataRenderer := renderer.Encoding[defines.ExportedPostMetadata]{
			EncoderFactory: JSONEncoderFactory,
			FileName:       "metadata.json",
		}
		postSummaryMetadataRenderer := renderer.Encoding[defines.SummaryExportedPostMetadata]{
			EncoderFactory: JSONEncoderFactory,
			FileName:       "summaryMetadata.json",
		}

		dirsRenderer := renderer.Dir[defines.Post]{
			DirPicker: func(ctx context.Context, data defines.Post) (dir string, err error) {
				dir = data.PostMetadata.DirName
				return
			},
			PostRenderer: renderer.RendererFunc[renderer.DirWrapper[defines.Post]](func(ctx context.Context, input renderer.DirWrapper[defines.Post], output renderer.RendererOutput) (err error) {
				err = copyRenderer.Render(ctx, input.Data.SrcFS, output)
				if err != nil {
					return
				}

				tags := []tsrender.SimpleTag{
					{
						Name: "PostHeader",
						Props: map[string]any{
							"metadata": tsrender.RawTagPropertyValue("summaryMetadata"),
						},
					},
				}
				tags = append(tags, input.Data.Content.ToSimpleTags()...)
				tags = append(tags, tsrender.SimpleTag{
					Name: "PostFooter",
					Props: map[string]any{
						"metadata": tsrender.RawTagPropertyValue("summaryMetadata"),
					},
				})

				err = tsComponentRenderer.Render(ctx, renderer.TSComponentRenderData{
					Tags:    tags,
					Imports: input.Data.Content.Imports,
				}, output)
				if err != nil {
					return
				}

				err = postMetadataRenderer.Render(ctx, input.Data.Exported(), output)
				if err != nil {
					return
				}

				err = postSummaryMetadataRenderer.Render(ctx, input.Data.Exported().Summary(), output)
				if err != nil {
					return
				}

				return
			}),
		}

		err = cleanRenderer.Render(ctx, struct{}{}, parentOutput)
		if err != nil {
			return
		}

		err = dirsRenderer.Render(ctx, posts, parentOutput)
		if err != nil {
			return
		}

		/// global renderers ///

		summaryIndexRenderer := renderer.Encoding[any]{
			EncoderFactory: JSONEncoderFactory,
			FileName:       "summaryIndex.json",
		}

		exportedMetas, err := iter.Collect(ctx, iter.Map(posts, func(ctx context.Context, data defines.Post) (defines.ExportedPostMetadata, error) {
			return data.Exported(), nil
		}))
		if err != nil {
			return
		}

		summaryExportedMetas, err := iter.Collect(ctx, iter.Map(posts, func(ctx context.Context, data defines.Post) (defines.SummaryExportedPostMetadata, error) {
			return data.Exported().Summary(), nil
		}))
		if err != nil {
			return
		}

		err = summaryIndexRenderer.Render(ctx, summaryExportedMetas, parentOutput)
		if err != nil {
			return
		}

		fuseIndexRenderer := renderer.FuseIndex[defines.ExportedPostMetadata]{
			FuseIndexOutputPath: "fuseIndex.json",
			CommandFactory:      commandFactory,
			FuseComandName:      "fuse_index.js",
			IndexFields:         []string{"title", "tags"},
		}

		err = fuseIndexRenderer.Render(ctx, exportedMetas, parentOutput)
		if err != nil {
			return
		}

		configEndpointsRenderer := renderer.Encoding[defines.Endpoints]{
			EncoderFactory: JSONEncoderFactory,
			FileName:       "configEndpoints.json",
		}

		err = configEndpointsRenderer.Render(ctx, eps, parentOutput)
		if err != nil {
			return
		}

		allEndpointsRenderer := renderer.Encoding[defines.Endpoints]{
			EncoderFactory: JSONEncoderFactory,
			FileName:       "allEndpoints.json",
		}

		err = posts.Iterate(ctx, iter.Receiver[defines.Post](func(ctx context.Context, data defines.Post) (err error) {
			eps.Endpoints = append(eps.Endpoints, data.PostMetadata.Path)
			return
		}))
		if err != nil {
			return
		}

		err = allEndpointsRenderer.Render(ctx, eps, parentOutput)
		if err != nil {
			return
		}

		postComponentsRenderer := renderer.TSIndex{
			FileName: "postComponents.tsx",
		}

		/*
			imports, err := iter.Collect(ctx, iter.Map(posts, func(ctx context.Context, data defines.Post) (res tsrender.Import, err error) {
				res = tsrender.Import{
					From:    path.Join(data.PostMetadata.DirName, "summaryMetadata.json"),
					Default: data.PostMetadata.DirName + "_metadata",
				}
				return
			}))
			if err != nil {
				return
			}
		*/

		entries, err := iter.Collect(ctx, iter.Map(posts, func(ctx context.Context, data defines.Post) (res map[string]string, err error) {
			res = map[string]string{
				"component": fmt.Sprintf("() => import(\"./%s\")", path.Join(data.PostMetadata.DirName, "Post")),
				"path":      fmt.Sprintf("\"%s\"", data.PostMetadata.Path),
			}
			return
		}))
		if err != nil {
			return
		}

		err = postComponentsRenderer.Render(ctx, renderer.TSIndexRenderData{
			Entries: iter.Slice(entries),
		}, parentOutput)
		if err != nil {
			return
		}

		return
	})
	if err != nil {
		return
	}

	return
}
