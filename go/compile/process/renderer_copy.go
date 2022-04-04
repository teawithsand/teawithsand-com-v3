package process

import (
	"context"
	"log"
	"os"
	"path"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type CopyRenderer struct {
	TargetPath    string
	PostDirPicker PostDirPicker
}

func (cr *CopyRenderer) Render(ctx context.Context, posts []Post) (err error) {
	log.Printf("Copying posts(with renamed dir names) to %s", cr.TargetPath)

	for i, p := range posts {
		var dir string
		dir, err = cr.PostDirPicker(ctx, i, p.PostMetadata)
		if err != nil {
			return
		}
		targetDir := path.Join(cr.TargetPath, dir)
		err = os.Mkdir(targetDir, 0770)
		if err != nil {
			return
		}

		err = fsutil.CopyDirectory(p.Dir, targetDir)
		if err != nil {
			log.Panicln("here", err)
			return
		}
	}

	return
}
