package serve

import (
	"bytes"
	"context"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/gorilla/mux"
	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/httpext"
	"github.com/teawithsand/twsblog/render"
)

const entrypointName = "app"

func MakeRouter(config Config) (h http.Handler, err error) {
	r := mux.NewRouter()

	ctx := context.Background()

	var notFoundHandler http.Handler
	var homeHandler http.Handler
	var staticAssetsHandler http.Handler
	var data PageData

	var dataFS fsal.FS

	if config.Env == "prod" {
		dataFS = &fsal.PrefixFS{
			PathPrefix: AssetsPrefix,
			Wrapped: &fsal.EmbedFS{
				FS: EmbeddedAssets,
			},
		}
		loader := PageDataLoader{
			DataFS: dataFS,
		}

		data, err = loader.LoadData(ctx)
		if err != nil {
			return
		}

		b := bytes.NewBuffer(nil)

		var renderData render.RenderHTMLData
		renderData, err = data.GetHTMLRenderData(ctx, entrypointName)
		if err != nil {
			return
		}

		err = render.RenderHTML(renderData, b)
		if err != nil {
			return
		}

		templates := b.Bytes()

		staticAssetsHandler = httpext.PrecompressedHandler(http.FS(StrippedPrefixAssets), nil)

		notFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(404)
			w.Write(templates)
		})
		homeHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html")
			w.Write(templates)
		})
	} else {
		dataFS = &fsal.PrefixFS{
			Wrapped:    &fsal.LocalFS{},
			PathPrefix: config.DebugPath,
		}
		loader := PageDataLoader{
			DataFS: dataFS,
		}

		staticAssetsHandler = httpext.PrecompressedHandler(http.Dir(config.DebugPath), nil)

		homeHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var err error

			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(200)

			data, err = loader.LoadData(ctx)
			if err != nil {
				log.Println("cant load data due to", err)
				return
			}

			renderData, err := data.GetHTMLRenderData(r.Context(), entrypointName)
			if err != nil {
				log.Println("cant make render data due to", err)
				return
			}

			err = render.RenderHTML(renderData, w)
			if err != nil {
				return
			}
		})

		notFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var err error

			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(404)

			data, err = loader.LoadData(ctx)
			if err != nil {
				log.Println("cant load data due to", err)
				return
			}

			renderData, err := data.GetHTMLRenderData(r.Context(), entrypointName)
			if err != nil {
				log.Println("cant make render data due to", err)
				return
			}

			err = render.RenderHTML(renderData, w)
			if err != nil {
				log.Println("cant render HTML due to", err)
				return
			}
		})
	}

	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	r.Methods("GET", "HEAD").
		PathPrefix("/dist").
		Handler(
			http.StripPrefix("/dist", staticAssetsHandler),
		)

	r.NotFoundHandler = notFoundHandler

	if config.Env == "prod" {
		for _, p := range data.Endpoints.Endpoints {

			// in prod serve precached version
			htmlPath := path.Join("html", p+".html")

			r.Methods("GET", "HEAD").
				Path(p).
				Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					w.Header().Set("Content-Type", "text/html")
					w.WriteHeader(200)

					// doPush(w, []string{})

					f, err := dataFS.Open(htmlPath, os.O_RDONLY)
					if errors.Is(err, os.ErrNotExist) {
						homeHandler.ServeHTTP(w, r)
						return
					} else if err != nil {
						log.Println("can't display home for path", p, "due to", err)
						return
					}
					defer f.Close()

					io.Copy(w, f)
				}))
		}
	} else {
		r.Methods("GET", "HEAD").Path("/").Handler(homeHandler)
	}

	h = r
	h = fmw.Apply(h)
	return
}
