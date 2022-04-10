package serve

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/teawithsand/handmd/util/httpext"
)

func MakeRouter(config Config) (h http.Handler, err error) {
	r := mux.NewRouter()

	var homeHandler http.Handler
	var staticAssetsHandler http.Handler
	if config.Env == "prod" {
		// homeHandler = MakeProdHomePathHandler()
		staticAssetsHandler = httpext.PrecompressedHandler(http.FS(EmbeddedAssets), nil)
	} else {
		basePath := config.DebugPath
		d := http.Dir(basePath)
		staticAssetsHandler = httpext.PrecompressedHandler(d, nil)

		// homeHandler = MakeDebugHomeHandler(basePath)
	}

	fmw := httpext.CacheMW{
		ForceDisable: true,
	}

	r.Methods("GET", "HEAD").
		PathPrefix("/dist").
		Handler(
			http.StripPrefix("/dist", staticAssetsHandler),
		)

	r.NotFoundHandler = homeHandler
	// r.Methods("GET", "HEAD").Path("/").Handler(homeHandler)

	h = r
	h = fmw.Apply(h)
	return
}
