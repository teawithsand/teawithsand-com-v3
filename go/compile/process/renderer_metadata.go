package process

import (
	"context"
	"encoding/json"
	"os"
	"path"
)

type MetadataRenderer struct {
	TargetPath    string
	PostDirPicker PostDirPicker
}

func (dr *MetadataRenderer) Render(ctx context.Context, metadata []PostMetadata) (err error) {
	for i, m := range metadata {
		var encoded []byte
		encoded, err = json.Marshal(m)
		if err != nil {
			return
		}

		var dir string
		dir, err = dr.PostDirPicker(ctx, i, m)
		if err != nil {
			return
		}

		err = os.WriteFile(path.Join(dr.TargetPath, dir, "compiledMetadata.json"), encoded, 0660)
		if err != nil {
			return
		}

	}

	return
}
