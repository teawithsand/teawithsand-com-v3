package cext

import (
	"context"
	"time"
)

var timeVar = ContextVar{
	Name: ContextVarName("util/cext/time"),
}

// Used to maintain consistent now in whole context.
// This way multiple created entities have exactly same now always.
// Fallbacks to time.Now if value not set in context.
func Now(ctx context.Context) time.Time {
	t := timeVar.Get(ctx)
	if t == nil {
		// HACK(teawithsand): implement it
		return time.Now()
	} else {
		return t.(time.Time)
	}
}

func PutNow(ctx context.Context, t time.Time) context.Context {
	if t.IsZero() {
		t = time.Now()
	}

	return timeVar.Put(ctx, t)
}
