package httpext

import (
	"context"
	"encoding/json"
	"io"
)

type Loader interface {
	LoadData(ctx context.Context, r io.Reader, res interface{}) (err error)
}

type JSONLoader struct{}

func (ld *JSONLoader) LoadData(ctx context.Context, r io.Reader, res interface{}) (err error) {
	d := json.NewDecoder(r)
	return d.Decode(res)
}
