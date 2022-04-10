package serve

/*
func buildData(ep webpackparse.Entrypoint, nce string) (headTags simplesite.HTMLTag) {
	ep.AddToData(webpackparse.AddOptions{
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
*/

/*

func MakeProdHomePathHandler() (h http.Handler) {
	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	cspNonceGenerator := nonce.HexGenerator{
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

		webpackData := buildData(ep, nce)

		doPush(w, webpackData)

		w.Header().Set(
			"Content-Security-Policy",
			fmt.Sprintf(
				`object-src 'none'; style-src  'nonce-%s' 'unsafe-inline' https: http:; script-src 'nonce-%s' 'unsafe-inline' 'strict-dynamic' https: http:; base-uri 'none';`,
				nce,
				nce,
			),
		)

		w.WriteHeader(200)
		webpack.RenderTemplate(w, webpackData)
	}))
}

*/
