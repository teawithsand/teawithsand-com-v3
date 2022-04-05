package compile

import (
	"context"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type DefaultRendererOutput struct {
	TargetFS fsutil.FS
}

func (dro *DefaultRendererOutput) FS() fsutil.FS {
	return dro.TargetFS
}

type RendererOutput interface {
	FS() fsutil.FS // nil, if FS output is not supported
}

type Renderer[T any] interface {
	Render(ctx context.Context, input T, output RendererOutput) (err error)
}
