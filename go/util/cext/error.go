package cext

import (
	"context"
)

var errorVar = ContextVar{
	Name: ContextVarName("util/cext/error"),
}

// Used to pass error from controller to logging framework.
// It's quite useful.
func Error(ctx context.Context) error {
	err := errorVar.Get(ctx)
	if err == nil {
		return nil
	}
	return err.(error)
}

func PutError(ctx context.Context, err error) context.Context {
	return errorVar.Put(ctx, err)
}
