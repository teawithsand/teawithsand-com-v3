package process

import (
	"context"

	"github.com/teawithsand/twsblog/util/slug"
)

type Processor[I, O any] interface {
	Process(ctx context.Context, input I) (output O, err error)
}

type DefaultProcessor struct {
}

func (dpp *DefaultProcessor) Process(ctx context.Context, raw RawPost) (post Post, err error) {
	post.PostMetadata = PostMetadata{
		Path: "/post/" + raw.Metadata.CreatedAt.Format("2006-02-01") + "/" + slug.Make(raw.Metadata.Title),

		Title: raw.Metadata.Title,
		Tags:  raw.Metadata.Tags,

		CreatedAt:    raw.Metadata.CreatedAt,
		LastEditedAt: raw.Metadata.LastEditedAt,
	}
	post.Dir = raw.Dir
	return
}
