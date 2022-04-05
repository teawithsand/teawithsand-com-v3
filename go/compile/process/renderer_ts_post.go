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

type tsPostRenderComponent struct {
	Tag     string
	Content string
	Props   map[string]string
}

type tsPostTemplateData struct {
	Imports    map[string]string
	Components []tsPostRenderComponent
}

const tsRenderPostTemplate = `
{{ range $k, $v := .Imports }}
import {{$k}} from "{{ $v }}"{{end}}

export default () => {
	return <>
		{{ range .Components }}
			{{ if not .Content }}
				<{{ .Tag }}
				{{ range $k, $v := .Imports }}
				{{$k}}="{{$v}}"{{ end }}
				/>
			{{ else }}
				<{{ .Tag }}
					{{ range $k, $v := .Imports }}
					{{$k}}="{{$v}}"{{ end }}
				>
					{{ .Content }}
				</{{ .Tag }}>
			{{ end }}
		{{end}}
	</>
}
`

func compileTsRenderPostTemplate() *template.Template {
	tpl, err := template.New("default").Parse(strings.TrimSpace(tsRenderPostTemplate))
	if err != nil {
		panic(err)
	}

	return tpl
}

var compiledTsRenderPostTemplate = compileTsRenderPostTemplate()

const EmptyTagName = "SimpleText"

type TSPostRenderer struct {
	TargetPath    string
	PostDirPicker PostDirPicker
	TagImporter   func(tag string) (string, error)
}

func (tir *TSPostRenderer) Render(ctx context.Context, posts []Post) (err error) {
	for i, p := range posts {
		var dir string
		dir, err = tir.PostDirPicker(ctx, i, p.PostMetadata)
		if err != nil {
			return
		}
		targetPath := path.Join(tir.TargetPath, dir, "Post.tsx")
		log.Printf("Rendering Post.tsx file to %s", tir.TargetPath)

		components := []tsPostRenderComponent{}
		imports := map[string]string{
			"react": "React",
		}

		for _, content := range p.Content.Entries {
			tag := content.Tag
			if tag == "" {
				tag = EmptyTagName
			}

			var importName string
			importName, err = tir.TagImporter(tag)
			if err != nil {
				return
			}

			imports[EmptyTagName] = importName
			components = append(components, tsPostRenderComponent{
				Tag:     EmptyTagName,
				Content: content.Content,
				Props:   content.Props,
			})
		}

		b := bytes.NewBuffer(nil)
		err = compiledTsRenderPostTemplate.Execute(b, tsPostTemplateData{
			Imports:    imports,
			Components: components,
		})
		if err != nil {
			return
		}

		err = os.WriteFile(targetPath, b.Bytes(), 0660)
		if err != nil {
			return
		}
	}

	return
}
