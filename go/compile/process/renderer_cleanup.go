package process

import (
	"context"
	"errors"
	"os"
)

type CleanupRenderer struct {
	TargetDir string
}

func (cr *CleanupRenderer) Render(ctx context.Context, data interface{}) (err error) {
	err = os.RemoveAll(cr.TargetDir)
	if errors.Is(err, os.ErrNotExist) {
		err = nil
		return
	}

	err = os.Mkdir(cr.TargetDir, 0770)
	if err != nil {
		return
	}

	return
}
