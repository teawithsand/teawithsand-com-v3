package compile

import (
	"context"
)

type Processor[I, O any] interface {
	Process(ctx context.Context, input I) (output O, err error)
}
