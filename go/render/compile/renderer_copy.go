package compile

import (
	"context"
	"fmt"
	"log"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type CopyRenderer struct {
	SourcePath      string
	DestinationPath string

	Required bool
}

func (cr *CopyRenderer) Render(ctx context.Context, srcFs fsutil.FS, output RendererOutput) (err error) {
	log.Printf("Copying %s to %s\n", cr.SourcePath, cr.DestinationPath)

	exists, err := fsutil.Exists(srcFs, cr.SourcePath)
	if err != nil {
		return
	}

	if !exists && cr.Required {
		err = fmt.Errorf("can't copy %s; it does not exist", cr.SourcePath)
		return
	}
	if !exists {
		return
	}

	dstFs := output.FS()
	err = dstFs.MkdirAll(cr.DestinationPath)
	if err != nil {
		return
	}

	err = fsutil.CopyDirectory(srcFs, dstFs, cr.SourcePath, cr.DestinationPath)
	if err != nil {
		return
	}
	return
}
