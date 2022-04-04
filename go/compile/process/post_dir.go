package process

import "context"

type PostDirPicker = func(ctx context.Context, i int, metadata PostMetadata) (dir string, err error)
