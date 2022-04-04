package process

import "context"

type Renderer[T any] interface {
	Render(ctx context.Context, outputs []T) (err error)
}
