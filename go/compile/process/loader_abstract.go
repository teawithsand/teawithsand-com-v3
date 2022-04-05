package process

import (
	"context"

	"github.com/teawithsand/twsblog/util"
)

type Loader[T any] interface {
	Load(ctx context.Context, receiver util.Receiver[T]) (err error)
}
