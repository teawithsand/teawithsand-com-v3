package util

import "context"

type Receiver[T any] func(ctx context.Context, res T) (err error)

type Iterator[T any] interface {
	Iterate(ctx context.Context, res Receiver[T]) (err error)
}
