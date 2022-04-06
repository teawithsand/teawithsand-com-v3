package compile

import (
	"bytes"
	"context"
	"log"
	"strings"
	"text/template"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/fsutil"
)

const rawRenderTsIndexTemplate = `
{{ range $i, $el := .Metadata }}{{ if .PostMetadataFile }}
import * as metadata_{{$i}} from "./{{ .Dir }}/{{ .PostMetadataFile }}"{{end}}{{ end }}
export default [
	{{ range $i, $el := .Metadata }}
	{
		{{ if .ComponentFile }}
		"component": import("./{{ .Dir }}/{{ .ComponentFile }}"),{{ end }}
		{{ if .PostMetadataFile }}
		"metadata": metadata_{{$i}},{{ end }}
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

	PostMetadataFile string
	ComponentFile    string
}

type tsTemplateObj struct {
	Metadata []extPostMetadata
}

type TSIndexRenderer struct {
	TargetPath    string
	PostDirPicker PostDirPicker

	PostMetadataFile string
	ComponentFile    string
}

func (tir *TSIndexRenderer) Render(ctx context.Context, posts util.Iterator[Post], output RendererOutput) (err error) {
	log.Printf("Rendering postIndex.ts file to %s", tir.TargetPath)

	var extMetas []extPostMetadata

	fs := output.FS()

	err = posts.Iterate(ctx, util.Receiver[Post](func(ctx context.Context, data Post) (err error) {
		extMetas = append(extMetas, extPostMetadata{
			PostMetadata: data.PostMetadata,
			Dir:          data.Dir,

			PostMetadataFile: tir.PostMetadataFile,
			ComponentFile:    tir.ComponentFile,
		})
		return
	}))
	if err != nil {
		return
	}

	b := bytes.NewBuffer(nil)

	err = compiledRawRenderTsIndexTemplate.Execute(b, tsTemplateObj{
		Metadata: extMetas,
	})
	if err != nil {
		return
	}

	err = fsutil.WriteFile(fs, tir.TargetPath, b.Bytes())
	if err != nil {
		return
	}

	return
}
