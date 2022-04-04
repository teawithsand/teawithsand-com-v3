package slug

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
)

type Sluggifier interface {
	Slugify(ctx context.Context, name string) (slug string, err error)
}

type DefaultSluggifier struct {
}

func (ds *DefaultSluggifier) Slugify(ctx context.Context, name string) (slug string, err error) {
	n := rand.Int63()
	raw := Make(name)
	raw = strings.ReplaceAll(raw, "_", "-")
	raw = strings.ToLower(raw)
	slug = fmt.Sprintf("%s-%d", raw, n)
	return
}
