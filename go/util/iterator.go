package util

import "context"

type Receiver[T any] func(ctx context.Context, data T) (err error)

type Iterator[T any] interface {
	Iterate(ctx context.Context, recv Receiver[T]) (err error)
}

type IteratorFunc[T any] func(ctx context.Context, recv Receiver[T]) (err error)

func (f IteratorFunc[T]) Iterate(ctx context.Context, recv Receiver[T]) (err error) {
	return f(ctx, recv)
}

// Collects given iterator into slice.
func CollectIterator[T any](ctx context.Context, it Iterator[T]) (res []T, err error) {
	err = it.Iterate(ctx, Receiver[T](func(ctx context.Context, data T) (err error) {
		res = append(res, data)
		return
	}))
	return
}

// Creates iterator from slice given.
func SliceIterator[T any](data []T) Iterator[T] {
	return IteratorFunc[T](func(ctx context.Context, recv Receiver[T]) (err error) {
		for _, e := range data {
			err = recv(ctx, e)
			if err != nil {
				return
			}
		}

		return
	})
}

// Creates iterator, with changed element type.
func MapIterator[T, E any](it Iterator[T], mapper func(ctx context.Context, data T) (E, error)) Iterator[E] {
	return IteratorFunc[E](func(ctx context.Context, res Receiver[E]) (err error) {
		return it.Iterate(ctx, Receiver[T](func(ctx context.Context, data T) (err error) {
			mapped, err := mapper(ctx, data)
			if err != nil {
				return
			}
			return res(ctx, mapped)
		}))
	})
}
