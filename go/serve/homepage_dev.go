package serve

/*

func MakeDebugHomeHandler(epsDir string) (h http.Handler, err error) {
	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	cspNonceGenerator := nonce.HexGenerator{
		BytesLength: 16,
	}

	return fmw.Apply(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nce, err := cspNonceGenerator.GenerateNonce(r.Context())
		if err != nil {
			panic(err)
		}

		var eps webpackparse.EntrypointsJSONDoc

		f, err := os.OpenFile(path.Join(epsDir, "entrypoints.json"), os.O_RDONLY, 0)
		if err != nil {
			return
		}
		defer f.Close()

		err = json.NewDecoder(f).Decode(&eps)
		if err != nil {
			return
		}

		f.Close()

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
