package process

import (
	"context"
	"errors"
	"log"
	"os"
	"path"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/scripting"
)

type Loader[T any] interface {
	Load(ctx context.Context, receiver util.Receiver[T]) (err error)
}

// DefaultLoader, which loads RawPost.
type DefaultLoader struct {
	MetadataLoader *scripting.DataLoader
	ContentLoader  *scripting.RawDataLoader
	Dir            string
}

func (bc *DefaultLoader) LoadPostsDir(ctx context.Context, receiver util.Receiver[RawPost]) (err error) {
	entries, err := os.ReadDir(bc.Dir)
	if err != nil {
		return
	}

	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		log.Printf("[Loader] Found blog post: %s\b", e.Name())

		postDir := path.Join(bc.Dir, e.Name())

		var meta RawPostMetadata

		err = bc.MetadataLoader.ReadData(path.Join(postDir, "metadata"), &meta)
		if err != nil {
			return
		}

		var content []byte
		var ext string
		content, ext, err = bc.ContentLoader.ReadData(path.Join(postDir, "content"))
		if errors.Is(err, os.ErrNotExist) {
			err = nil
		}
		if err != nil {
			return
		}

		var post RawPost
		post.Metadata = meta
		post.Dir = postDir
		post.Content = RawPostContent{
			Content: content,
			Kind:    ext,
		}

		err = receiver(ctx, post)
		if err != nil {
			return
		}
	}

	return
}
