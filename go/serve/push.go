package serve

import (
	"errors"
	"net/http"
)

func doPush(w http.ResponseWriter, entries []string) (err error) {
	// for now disable http2 server push
	return

	defer func() {
		if errors.Is(err, http.ErrNotSupported) {
			err = nil
		}
	}()
	if pusher, ok := w.(http.Pusher); ok {
		for _, e := range entries {
			if err = pusher.Push(e, nil); err != nil {
				return
			}
		}
	}

	return
}
