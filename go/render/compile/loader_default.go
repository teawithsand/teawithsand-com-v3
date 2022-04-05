package compile

import (
	"context"
	"path"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/fsutil"
)

// DefaultLoader, which loads RawPost.
type DefaultLoader struct {
	MetadataLoader *fsutil.DataLoader
}

func (bc *DefaultLoader) Load(ctx context.Context, src LoaderInput) (iterator util.Iterator[RawPost], err error) {
	fs := src.FS()

	iterator = util.IteratorFunc[RawPost](func(ctx context.Context, recv util.Receiver[RawPost]) (err error) {
		entries, err := fs.ReadDir("/")
		if err != nil {
			return
		}

		for _, e := range entries {
			if !e.IsDir() {
				continue
			}

			postDir := e.Name()

			var meta RawPostMetadata
			var content PostContent

			err = bc.MetadataLoader.ReadData(fs, path.Join(postDir, "metadata"), &meta)
			if err != nil {
				return
			}

			err = bc.MetadataLoader.ReadData(fs, path.Join(postDir, "content"), &content)
			if err != nil {
				return
			}

			var post RawPost
			post.Metadata = meta
			post.Dir = postDir
			post.Content = content

			post.FS = &fsutil.PrefixFS{
				Wrapped:    fs,
				PathPrefix: postDir,
			}

			err = recv(ctx, post)
			if err != nil {
				return
			}
		}

		return
	})

	return
}
