package serve

import (
	"go.uber.org/dig"
)

func RegisterInContainer(c *dig.Container) (err error) {
	err = c.Provide(MakeRouter)
	if err != nil {
		return
	}

	err = c.Provide(MakeServer)
	if err != nil {
		return
	}

	return
}
