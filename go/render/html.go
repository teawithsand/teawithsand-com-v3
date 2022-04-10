package render

import (
	"io"
	"text/template"

	"github.com/teawithsand/handmd/util/simplesite"
)

const templateText = `
<!DOCTYPE html>
<html lang="en">
<head>
{{ .HeadTags }}
</head>
<body>
</body>
</html>
`

var compiledTemplate *template.Template

func init() {
	compiledTemplate = template.Must(template.New("").Parse(templateText))
}

type templateData struct {
	HeadTags string
}

func RenderHTML(headTags []simplesite.HTMLTag, w io.Writer) (err error) {
	tags := ""

	for _, tag := range headTags {
		var singleTag string
		singleTag, err = tag.RenderSimple()
		if err != nil {
			return
		}

		tags += singleTag + "\n"
	}

	err = compiledTemplate.Execute(w, templateData{
		HeadTags: tags,
	})
	if err != nil {
		return
	}

	return
}
