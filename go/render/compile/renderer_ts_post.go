package compile

import (
	"bytes"
	"context"
	"log"
	"strings"
	"text/template"

	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/typescript"
)

type tsPostRenderComponent struct {
	Tag     string
	Content string
	Props   map[string]string
}

type tsPostTemplateData struct {
	Imports    []typescript.Import
	Components []tsPostRenderComponent
}

const tsRenderPostTemplate = `
{{ range .Imports }}
{{ .Render }}{{end}}

export default () => {
	return <>
		{{ range .Components }}
			{{ if not .Content }}
				<{{ .Tag }}{{ range $k, $v := .Props }}
				{{$k}}={ {{$v}} }{{ end }}/>
			{{ else }}
				<{{ .Tag }}{{ range $k, $v := .Props }}
					{{$k}}={ {{$v}} }{{ end }}>
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
	TargetPath  string
	BaseImports []typescript.Import
}

func (tir *TSPostRenderer) Render(ctx context.Context, post Post, output RendererOutput) (err error) {
	log.Printf("Rendering Post typescript file to %s", tir.TargetPath)

	fs := output.FS()

	components := []tsPostRenderComponent{}
	imports := tir.BaseImports

	for k, v := range post.Content.Imports {
		imports[k] = v
	}

	importedSet := map[string]struct{}{}

	for _, i := range imports {
		importedSet[i.Default] = struct{}{}
		for _, o := range i.Others {
			importedSet[o] = struct{}{}
		}
		for _, o := range i.OthersAliased {
			importedSet[o[1]] = struct{}{}
		}
	}

	for _, content := range post.Content.Entries {
		tag := content.Tag

		components = append(components, tsPostRenderComponent{
			Tag:     tag,
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

	trimmed := bytes.TrimSpace(b.Bytes())

	err = fsutil.WriteFile(fs, tir.TargetPath, trimmed)
	if err != nil {
		return
	}

	return
}
