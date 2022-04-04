package util

import "context"

type Receiver[T any] func(ctx context.Context, res T) (err error)
