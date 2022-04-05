package process

import (
	"bytes"
	"context"
	"log"
	"os"
	"path"
	"strings"
	"text/template"
)

const rawRenderTsIndexTemplate = `
{{ range $i, $el := .Metadata }}
import * as metadata_{{$i}} from "./{{ .Dir }}/compiledMetadata.json"{{ end }}
export default [
	{{ range $i, $el := .Metadata }}
	{
		"component": import("./{{ .Dir }}/Post"),
		"compiledMetadata": metadata_{{$i}}
	}{{ if not $i }},{{ end }}{{ end }}
]
`

func compileRawRenderTsIndexTemplate() *template.Template {
	tpl, err := template.New("default").Parse(strings.TrimSpace(rawRenderTsIndexTemplate))
	if err != nil {
		panic(err)
	}

	return tpl
}

var compiledRawRenderTsIndexTemplate = compileRawRenderTsIndexTemplate()

type extPostMetadata struct {
	PostMetadata
	Dir string
}

type tsTemplateObj struct {
	Metadata []extPostMetadata
}

type TSIndexRenderer struct {
	TargetPath    string
	PostDirPicker PostDirPicker
}

func (tir *TSIndexRenderer) Render(ctx context.Context, metadata []PostMetadata) (err error) {
	log.Printf("Rendering Posts.ts file to %s", tir.TargetPath)
	b := bytes.NewBuffer(nil)

	var extMetas []extPostMetadata
	for i, m := range metadata {
		var dir string
		dir, err = tir.PostDirPicker(ctx, i, m)
		if err != nil {
			return
		}

		extMetas = append(extMetas, extPostMetadata{
			PostMetadata: m,
			Dir:          dir,
		})
	}

	err = compiledRawRenderTsIndexTemplate.Execute(b, tsTemplateObj{
		Metadata: extMetas,
	})
	if err != nil {
		return
	}

	err = os.WriteFile(path.Join(tir.TargetPath, "posts.ts"), b.Bytes(), 0660)
	if err != nil {
		return
	}

	return
}
