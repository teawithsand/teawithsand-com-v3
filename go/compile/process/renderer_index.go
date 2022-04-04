package process

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/teawithsand/twsblog/util/scripting"
)

type IndexRenderer struct {
	CombinedMetadataOutputPath string

	FuseIndexOutputPath string
	Scripts             *scripting.Collection
	FuseScriptName      string
}

func (dr *IndexRenderer) Render(ctx context.Context, metadata []PostMetadata) (err error) {
	var encoded []byte
	encoded, err = json.Marshal(metadata)
	if err != nil {
		return
	}

	if len(dr.CombinedMetadataOutputPath) > 0 {
		log.Printf("Rendering combined metadata to %s\n", dr.CombinedMetadataOutputPath)
		err = os.WriteFile(dr.CombinedMetadataOutputPath, encoded, 0660)
		if err != nil {
			return
		}
	}

	if len(dr.FuseIndexOutputPath) > 0 {
		log.Printf("Rendering fuseIndex to %s\n", dr.FuseIndexOutputPath)

		var f *os.File
		f, err = os.OpenFile(dr.FuseIndexOutputPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0660)
		if err != nil {
			return
		}
		defer f.Close()

		var cmd *scripting.Command
		cmd, err = dr.Scripts.GetCommand("fuse_index.js", []string{
			"title",
		})
		if err != nil {
			return
		}

		cmd.Input = bytes.NewReader(encoded)
		cmd.Output = f

		err = cmd.Exec(ctx)
		if err != nil {
			return
		}

		err = f.Close()
		if err != nil {
			return
		}
	}

	return
}
