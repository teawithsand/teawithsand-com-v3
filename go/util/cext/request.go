package cext

import (
	"context"
	"net/http"
)

var requestVar = ContextVar{
	Name: ContextVarName("util/cext/request"),
}

func Request(ctx context.Context) *http.Request {
	r := requestVar.Get(ctx)
	if r != nil {
		return r.(*http.Request)
	}
	return nil
}

func PutRequest(ctx context.Context, r *http.Request) context.Context {
	return requestVar.Put(ctx, r)
}
