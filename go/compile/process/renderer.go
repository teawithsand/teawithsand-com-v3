package process

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"
	"strings"
	"text/template"

	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/scripting"
)

type Renderer[T any] interface {
	Render(ctx context.Context, outputs []T) (err error)
}

type DefaultRenderer struct {
	TargetDir string

	Scripts *scripting.Collection
}

const rawTsTemplate = `
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

func compileTemplate() *template.Template {
	tpl, err := template.New("default").Parse(strings.TrimSpace(rawTsTemplate))
	if err != nil {
		panic(err)
	}

	return tpl
}

var compiledTemplate = compileTemplate()

type extPostMetadata struct {
	PostMetadata
	Dir string
}

type tsTemplateObj struct {
	Metadata []extPostMetadata
}

func (dr *DefaultRenderer) RenderPosts(ctx context.Context, posts []Post) (err error) {
	err = os.RemoveAll(dr.TargetDir)
	if err != nil {
		return
	}

	err = os.Mkdir(dr.TargetDir, 0770)
	if err != nil {
		return
	}

	postDir := func(i int) string {
		return fmt.Sprintf("post%d", i)
	}

	for i, p := range posts {
		postDir := path.Join(dr.TargetDir, postDir(i))

		err = os.Mkdir(postDir, 0770)
		if err != nil {
			return
		}

		err = fsutil.CopyDirectory(p.Dir, postDir)
		if err != nil {
			return
		}

		var encoded []byte
		encoded, err = json.Marshal(p.PostMetadata)
		if err != nil {
			return
		}

		err = os.WriteFile(path.Join(postDir, "compiledMetadata.json"), encoded, 0660)
		if err != nil {
			return
		}
	}

	var metadata []PostMetadata
	for _, p := range posts {
		metadata = append(metadata, p.PostMetadata)
	}

	var encoded []byte
	encoded, err = json.Marshal(metadata)
	if err != nil {
		return
	}

	err = os.WriteFile(path.Join(dr.TargetDir, "summaryMetadata.json"), encoded, 0660)
	if err != nil {
		return
	}

	log.Println("Rendering fuseIndex...")
	f, err := os.OpenFile(path.Join(dr.TargetDir, "fuseIndex.json"), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0660)
	if err != nil {
		return
	}
	defer f.Close()

	cmd, err := dr.Scripts.GetCommand("fuse_index.js", []string{
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

	log.Println("Rendering Posts.ts file")
	b := bytes.NewBuffer(nil)

	var extMetas []extPostMetadata
	for i, m := range metadata {
		extMetas = append(extMetas, extPostMetadata{
			PostMetadata: m,
			Dir:          postDir(i),
		})
	}

	err = compiledTemplate.Execute(b, tsTemplateObj{
		Metadata: extMetas,
	})
	if err != nil {
		return
	}

	err = os.WriteFile(path.Join(dr.TargetDir, "Posts.ts"), b.Bytes(), 0660)
	if err != nil {
		return
	}

	return
}
