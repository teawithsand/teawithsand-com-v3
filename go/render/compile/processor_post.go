package compile

import (
	"context"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/slug"
)

type DefaultProcessor struct {
	PostFSPicker func(raw RawPost, meta PostMetadata) fsutil.FS
}

func (dpp *DefaultProcessor) Process(ctx context.Context, raw RawPost) (post Post, err error) {
	ng := util.HexNonceGenerator{
		BytesLength: 16,
	}
	unstableId, err := ng.GenerateNonce(ctx)
	if err != nil {
		return
	}

	path := raw.PermalinkText
	if len(path) == 0 {
		path = "/post/" + raw.Metadata.CreatedAt.Format("2006-02-01") + "/" + slug.Make(raw.Metadata.Title)
	} else {
		path = "/post/" + raw.Metadata.CreatedAt.Format("2006-02-01") + "/" + slug.Make(path)
	}

	post.PostMetadata = PostMetadata{
		UnstableID: unstableId,
		Path:       path,

		Title: raw.Metadata.Title,
		Tags:  raw.Metadata.Tags,

		Slug: slug.Make(raw.Metadata.Title),

		CreatedAt:    raw.Metadata.CreatedAt,
		LastEditedAt: raw.Metadata.LastEditedAt,

		DirName: raw.Dir,
	}
	post.Dir = raw.Dir
	post.DstFs = dpp.PostFSPicker(raw, post.PostMetadata)
	post.SrcFs = raw.FS
	post.Content = raw.Content
	return
}
