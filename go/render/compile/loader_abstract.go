package compile

import (
	"context"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type DefaultLoaderInput struct {
	TargetFS fsutil.FS
}

func (src *DefaultLoaderInput) FS() fsutil.FS {
	return src.TargetFS
}

type LoaderInput interface {
	FS() fsutil.FS // nil if not available
}

type Loader[T any] interface {
	Load(ctx context.Context, src LoaderInput) (res T, err error)
}
