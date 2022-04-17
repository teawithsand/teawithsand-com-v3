package render

import (
	"context"

	"github.com/gosimple/slug"
	"github.com/teawithsand/handmd/compile/loader"
	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/twsblog/render/defines"
	"go.uber.org/dig"
)

type RawPostMetadataLoader loader.Loader[any, defines.RawPostMetadata]
type PostContentLoader loader.Loader[any, defines.PostContent]
type EndpointsLoader loader.Loader[any, Endpoints]
type DirLoader loader.Loader[any, iter.Iterable[defines.RawPost]]

type RawPosts iter.Iterable[defines.RawPost]
type Posts iter.Iterable[defines.Post]
type Endpoints defines.Endpoints
type ExportedPostMetadatas iter.Iterable[defines.ExportedPostMetadata]
type SummaryExportedPostsMetadatas iter.Iterable[defines.SummaryExportedPostMetadata]

func RegisterPostLoadersInDI(c *dig.Container) (err error) {
	err = c.Provide(func(parsers DataParsers) (res RawPostMetadataLoader, err error) {
		res = &loader.Config[any, defines.RawPostMetadata]{
			Loader: fsal.DataLoader{
				Parsers: parsers,
			},
			Factory: func() *defines.RawPostMetadata {
				return &defines.RawPostMetadata{}
			},
			FileName: "metadata",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(parsers DataParsers) (res PostContentLoader, err error) {
		res = &loader.Config[any, defines.PostContent]{
			Loader: fsal.DataLoader{
				Parsers: parsers,
			},
			Factory: func() *defines.PostContent {
				return &defines.PostContent{}
			},
			FileName: "content",
		}
		return
	})
	if err != nil {
		return
	}

	return
}

func RegisterGlobalLoadersInDI(c *dig.Container) (err error) {
	err = c.Provide(func(parsers DataParsers) (res EndpointsLoader, err error) {
		res = &loader.Config[any, Endpoints]{
			Loader: fsal.DataLoader{
				Parsers: parsers,
			},
			Factory: func() *Endpoints {
				return &Endpoints{}
			},
			FileName: "endpoints",
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(
		parsers DataParsers,
		metadataLoader RawPostMetadataLoader,
		contentLoader PostContentLoader,
	) (res DirLoader, err error) {
		res = &loader.Dir[any, defines.RawPost]{
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
		return
	})
	if err != nil {
		return
	}

	return
}

func RegisterDefinesInDI(c *dig.Container) (err error) {
	err = c.Provide(func(ctx context.Context, dirLoader DirLoader, input InputFileSystem) (res RawPosts, err error) {
		res, err = dirLoader.Load(ctx, nil, input)
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(ctx context.Context, input InputFileSystem, endpointsLoader EndpointsLoader) (ep Endpoints, err error) {
		ep, err = endpointsLoader.Load(ctx, nil, input)
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(ctx context.Context, raw RawPosts, unstableIdGenerator UnstableIDGenerator) (res Posts, err error) {
		imm := iter.Map[defines.RawPost](raw, func(ctx context.Context, raw defines.RawPost) (res defines.Post, err error) {
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

	err = c.Provide(func(ctx context.Context, posts Posts) (metadatas ExportedPostMetadatas, err error) {
		metadatas = iter.Map[defines.Post](posts, func(ctx context.Context, data defines.Post) (defines.ExportedPostMetadata, error) {
			return data.Exported(), nil
		})
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func(ctx context.Context, posts Posts) (metadatas SummaryExportedPostsMetadatas, err error) {
		metadatas = iter.Map[defines.Post](posts, func(ctx context.Context, data defines.Post) (defines.SummaryExportedPostMetadata, error) {
			return data.Exported().Summary(), nil
		})
		return
	})
	if err != nil {
		return
	}

	return
}
