package compile

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"os"
	"sync"

	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/scripting"
)

type FuseIndexRenderer[T any] struct {
	FuseIndexOutputPath string
	Scripts             *scripting.Collection
	FuseScriptName      string
	IndexFields         []string
}

func (dr *FuseIndexRenderer[T]) Render(ctx context.Context, input []T, output RendererOutput) (err error) {
	log.Printf("Rendering fuseIndex to %s\n", dr.FuseIndexOutputPath)

	fs := output.FS()

	var f fsutil.File
	f, err = fs.Open(dr.FuseIndexOutputPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC)
	if err != nil {
		return
	}
	defer f.Close()

	var cmd *scripting.Command
	cmd, err = dr.Scripts.GetCommand("fuse_index.js", dr.IndexFields)
	if err != nil {
		return
	}

	pr, pw := io.Pipe()
	wg := sync.WaitGroup{}
	wg.Add(1)

	var encodeError error
	go func() {
		defer wg.Done()
		defer pw.Close()

		enc := json.NewEncoder(pw)
		err = enc.Encode(input)
		if encodeError != nil {
			return
		}
	}()

	cmd.Input = pr
	cmd.Output = f

	err = cmd.Exec(ctx)
	if err != nil {
		return
	}

	err = f.Close()
	if err != nil {
		return
	}

	_, err = io.Copy(io.Discard, pr)
	if err != nil {
		return
	}

	wg.Wait()

	if encodeError != nil {
		err = encodeError
		return
	}

	return
}
