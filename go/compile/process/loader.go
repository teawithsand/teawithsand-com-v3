package process

import (
	"context"
	"log"
	"os"
	"path"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/scripting"
)

// DefaultLoader, which loads RawPost.
type DefaultLoader struct {
	MetadataLoader *scripting.DataLoader
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
		var content PostContent

		err = bc.MetadataLoader.ReadData(path.Join(postDir, "metadata"), &meta)
		if err != nil {
			return
		}

		err = bc.MetadataLoader.ReadData(path.Join(postDir, "content"), &content)
		if err != nil {
			return
		}

		var post RawPost
		post.Metadata = meta
		post.Dir = postDir
		post.Content = content

		err = receiver(ctx, post)
		if err != nil {
			return
		}
	}

	return
}
