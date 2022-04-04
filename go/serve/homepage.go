package serve

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path"

	"github.com/teawithsand/twsblog/util"
	"github.com/teawithsand/twsblog/util/httpext"
	"github.com/teawithsand/twsblog/util/webpack"
)

func buildData(ep webpack.Entrypoint, nce string) (tplData webpack.Data) {
	ep.AddToData(webpack.AddOptions{
		Nonce: nce,
		Defer: true,
	}, &tplData)

	// tplData.Scripts = append(tplData.Scripts, tpl.Script{
	// 	Nonce: nce,
	// 	Src:   "https://www.recaptcha.net/recaptcha/api.js",
	// 	Async: true,
	// 	Defer: true,
	// })

	tplData.Metas = append(tplData.Metas, webpack.Meta{
		Name:    "viewport",
		Content: "width=device-width, initial-scale=1",
	})

	tplData.Metas = append(tplData.Metas, webpack.Meta{
		Name:    "author",
		Content: "teawithsand",
	})
	tplData.Metas = append(tplData.Metas, webpack.Meta{
		Name:    "description",
		Content: "Teawithsand's blog and portfolio website",
	})

	tplData.Title = "teawithsand.com"

	return
}

func MakeDebugHomeHandler(epsDir string) (h http.Handler) {
	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	cspNonceGenerator := util.HexNonceGenerator{
		BytesLength: 16,
	}

	return fmw.Apply(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nce, err := cspNonceGenerator.GenerateNonce(r.Context())
		if err != nil {
			panic(err)
		}

		// for dev load entrypoints.json here
		// in prod load once
		rawEntrypoints, err := ioutil.ReadFile(path.Join(epsDir, "entrypoints.json"))
		if err != nil {
			panic(err)
		}

		eps, err := webpack.ParseEntrypointsJSON(rawEntrypoints)
		if err != nil {
			panic(err)
		}
		ep := eps.App

		tplData := buildData(ep, nce)

		w.Header().Set(
			"Content-Security-Policy",
			fmt.Sprintf(
				`object-src 'none'; style-src  'nonce-%s' 'unsafe-inline' https: http:; script-src 'nonce-%s' 'unsafe-inline' 'strict-dynamic' https: http:; base-uri 'none';`,
				nce,
				nce,
			),
		)

		w.WriteHeader(200)
		webpack.RenderTemplate(w, tplData)
	}))
}

func MakeProdHomePathHandler() (h http.Handler) {
	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	cspNonceGenerator := util.HexNonceGenerator{
		BytesLength: 16,
	}

	rawEntrypoints, err := EmbeddedAssets.ReadFile("entrypoints.json")
	if err != nil {
		panic(err)
	}

	eps, err := webpack.ParseEntrypointsJSON(rawEntrypoints)
	if err != nil {
		panic(err)
	}
	ep := eps.App

	return fmw.Apply(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nce, err := cspNonceGenerator.GenerateNonce(r.Context())
		if err != nil {
			// well, this should never fail...
			panic(err)
		}

		tplData := buildData(ep, nce)

		w.Header().Set(
			"Content-Security-Policy",
			fmt.Sprintf(
				`object-src 'none'; style-src  'nonce-%s' 'unsafe-inline' https: http:; script-src 'nonce-%s' 'unsafe-inline' 'strict-dynamic' https: http:; base-uri 'none';`,
				nce,
				nce,
			),
		)

		w.WriteHeader(200)
		webpack.RenderTemplate(w, tplData)
	}))
}
