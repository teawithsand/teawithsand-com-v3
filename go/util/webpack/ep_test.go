package webpack_test

import (
	"testing"

	"github.com/teawithsand/twsblog/util/webpack"
)

const sampleEntrypoint = `
{
	"entrypoints": {
	  "app": {
		"js": [
		  "/dist/vendors-node_modules_core-js_modules_es_array_unscopables_flat-map_js-node_modules_core-js_mo-019092.js",
		  "/dist/app.js"
		],
		"css": [
		  "/dist/app.css"
		]
	  }
	}
}`

func TestCanParseSampleEntryPoint(t *testing.T) {
	eps, err := webpack.ParseEntrypointsJSON([]byte(sampleEntrypoint))
	if err != nil {
		t.Error(err)
		return
	}
	if len(eps.App.Css) == 0 || len(eps.App.Js) == 0 {
		t.Error("filed to ok parse")
		return
	}
}
