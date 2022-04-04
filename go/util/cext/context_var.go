package cext

import (
	"context"
	"fmt"
)

type ContextVarName string

type ContextVar struct {
	Name ContextVarName
}

func (vr *ContextVar) Put(ctx context.Context, val interface{}) (res context.Context) {
	res = context.WithValue(ctx, vr.Name, val)
	return
}

func (vr *ContextVar) Get(ctx context.Context) (res interface{}) {
	res = ctx.Value(vr.Name)
	return
}

func (vr *ContextVar) MustGet(ctx context.Context) (res interface{}) {
	res = ctx.Value(vr.Name)
	if res == nil {
		panic(fmt.Errorf("util/cext: value not found %s", vr.Name))
	}
	return
}
