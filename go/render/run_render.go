package render

import (
	"context"

	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/twsblog/util/cfg"
	"go.uber.org/dig"
)

func Run() (err error) {
	ctx := context.Background()

	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}
	c := dig.New()

	err = c.Provide(func() (res DIExternals, err error) {
		res = DIExternals{
			OutputFileSystem: &fsal.PrefixFS{
				Wrapped:    &fsal.LocalFS{},
				PathPrefix: config.EmitPath,
			},
			InputFileSystem: &fsal.PrefixFS{
				Wrapped:    &fsal.LocalFS{},
				PathPrefix: config.SourcePath,
			},
			Context: ctx,
		}
		return
	})
	if err != nil {
		return
	}

	err = InitDI(c)
	if err != nil {
		return
	}

	defer c.Invoke(func(c Cleaner) (err error) {
		return c.Close()
	})

	err = DIPerformRender(c)
	if err != nil {
		return
	}

	return
}
