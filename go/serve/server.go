package serve

import (
	"net/http"
	"time"
)

func MakeServer(h http.Handler) (res *http.Server, err error) {
	s := &http.Server{
		MaxHeaderBytes: 1024 * 8,
		Handler:        h,

		ReadHeaderTimeout: time.Second * 10,

		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 30,
		IdleTimeout:  time.Second * 15,
	}

	res = s
	return
}
