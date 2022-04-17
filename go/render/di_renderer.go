package render

import (
	"context"

	"github.com/teawithsand/handmd/compile/renderer"
	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/handmd/util/tsrender"
	"github.com/teawithsand/twsblog/render/defines"
	"go.uber.org/dig"
)

type CleanRenderer renderer.Renderer[struct{}]
type FuseIndexRenderer renderer.Renderer[[]defines.ExportedPostMetadata]
type AllEndpointsRenderer renderer.Renderer[defines.Endpoints]
type TsIndexRenderer renderer.Renderer[renderer.TSIndexRenderData]
type SummaryExportedMetadataRenderer renderer.Renderer[[]defines.SummaryExportedPostMetadata]

type CopyPostRenderer renderer.Renderer[fsal.FS]
type TSPostRenderer renderer.Renderer[renderer.TSComponentRenderData]
type MetadataPostRenderer renderer.Renderer[defines.ExportedPostMetadata]
type SummaryExportedMetadataPostRenderer renderer.Renderer[defines.SummaryExportedPostMetadata]
type PostRenderer renderer.Renderer[iter.Iterable[defines.Post]]

func RegisterGlobalRenderers(c *dig.Container) (err error) {
	err = c.Provide(func() (res CleanRenderer, err error) {
		res = &renderer.Clean{}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(commandFactory CommandFactory) (res FuseIndexRenderer, err error) {
		res = &renderer.FuseIndex[defines.ExportedPostMetadata]{
			FuseIndexOutputPath: "fuseIndex.json",
			CommandFactory:      commandFactory,
			FuseComandName:      "fuse_index.js",
			IndexFields:         []string{"title", "tags"},
		}
		return
	})
	if err != nil {
		return
	}

	/*
		err = c.Provide(func(commandFactory CommandFactory, encoder JSONEncoderFactory) (res ConfigEndpointsRenderer, err error) {
			res = &renderer.Encoding[defines.Endpoints]{
				EncoderFactory: encoder,
				FileName:       "configEndpoints.json",
			}
			return
		})
		if err != nil {
			return
		}
	*/

	err = c.Provide(func(encoder JSONEncoderFactory) (res SummaryExportedMetadataRenderer, err error) {
		res = &renderer.Encoding[[]defines.SummaryExportedPostMetadata]{
			EncoderFactory: encoder,
			FileName:       "summaryIndex.json",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(commandFactory CommandFactory, encoder JSONEncoderFactory) (res AllEndpointsRenderer, err error) {
		res = &renderer.Encoding[defines.Endpoints]{
			EncoderFactory: encoder,
			FileName:       "allEndpoints.json",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res TsIndexRenderer, err error) {
		res = &renderer.TSIndex{
			FileName: "postComponents.tsx",
		}
		return
	})
	if err != nil {
		return
	}

	return
}

func RegisterPostRenderers(c *dig.Container) (err error) {
	err = c.Provide(func() (res CopyPostRenderer, err error) {
		res = &renderer.Copy{
			SourcePath:      "/assets",
			DestinationPath: "/assets",
			Required:        false,
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res TSPostRenderer, err error) {
		res = &renderer.TSComponent{
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
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(encoder JSONEncoderFactory) (res MetadataPostRenderer, err error) {
		res = &renderer.Encoding[defines.ExportedPostMetadata]{
			EncoderFactory: encoder,
			FileName:       "metadata.json",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(encoder JSONEncoderFactory) (res SummaryExportedMetadataPostRenderer, err error) {
		res = &renderer.Encoding[defines.SummaryExportedPostMetadata]{
			EncoderFactory: encoder,
			FileName:       "summaryMetadata.json",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(
		tsComponentRenderer TSPostRenderer,
		copyRenderer CopyPostRenderer,
		postMetadataRenderer MetadataPostRenderer,
		postSummaryMetadataRenderer SummaryExportedMetadataPostRenderer,
	) (res PostRenderer, err error) {
		res = &renderer.Dir[defines.Post]{
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

		return
	})

	return
}
