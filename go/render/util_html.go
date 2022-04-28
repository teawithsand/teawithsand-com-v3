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
<div id="root"><h1>Loading...</h1></div>
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

type RenderHTMLData struct {
	HeadTags []simplesite.HTMLTag
}

func RenderHTML(data RenderHTMLData, w io.Writer) (err error) {
	// HACK: it should not be there
	tags := `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">`

	for _, tag := range data.HeadTags {
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
