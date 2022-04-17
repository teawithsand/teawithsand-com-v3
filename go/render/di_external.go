package render

import (
	"context"

	"github.com/teawithsand/handmd/util/fsal"
	"go.uber.org/dig"
)

type Context = context.Context

type InputFileSystem fsal.FS
type OutputFileSystem fsal.FS

type DIExternals struct {
	dig.Out

	Context          Context
	InputFileSystem  InputFileSystem
	OutputFileSystem OutputFileSystem
}
