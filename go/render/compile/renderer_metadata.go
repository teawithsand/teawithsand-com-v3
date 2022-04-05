package compile

import (
	"context"
	"encoding/json"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type MetadataRenderer struct {
}

func (dr *MetadataRenderer) Render(ctx context.Context, input PostMetadata, output RendererOutput) (err error) {
	fs := output.FS()

	var encoded []byte
	encoded, err = json.Marshal(input)
	if err != nil {
		return
	}

	err = fsutil.WriteFile(fs, "metadata.json", encoded)
	if err != nil {
		return
	}

	return
}
