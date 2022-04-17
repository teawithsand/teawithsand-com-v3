package render_test

import (
	"testing"

	"github.com/teawithsand/twsblog/render"
	"go.uber.org/dig"
)

func TestGlobalDI(t *testing.T) {
	err := render.InitDI(dig.New())
	if err != nil {
		t.Error(err)
		return
	}
}
