package serve

import (
	"net/http"
)

func doPush(w http.ResponseWriter, entries []string) (err error) {
	// Push does not support sending compressed assets
	//  so we won't use it
	/*
		defer func() {
			if errors.Is(err, http.ErrNotSupported) {
				err = nil
			}
		}()
		if pusher, ok := w.(http.Pusher); ok {
			for _, e := range entries {
				if err = pusher.Push(e, &http.PushOptions{
					Header: w.Header(), // use same headers as for current requests, this is mainly about compression
				}); err != nil {
					log.Printf("Push error %+#v\n", err)
					return
				}
			}
		}
	*/

	return
}
