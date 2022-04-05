package compile

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type JSONRenderer[T any] struct {
	FileName string
}

func (jr *JSONRenderer[T]) Render(ctx context.Context, input T, output RendererOutput) (err error) {
	log.Printf("Rendering JSON to %s\n", jr.FileName)

	fs := output.FS()

	var f fsutil.File
	f, err = fs.Open(jr.FileName, os.O_CREATE|os.O_WRONLY|os.O_TRUNC)
	if err != nil {
		return
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "\t")
	err = enc.Encode(input)
	if err != nil {
		return
	}

	err = f.Close()
	if err != nil {
		return
	}
	return
}
