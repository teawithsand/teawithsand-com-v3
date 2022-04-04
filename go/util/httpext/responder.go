package httpext

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
)

type StatusResponse interface {
	GetStatus() int
}

type HeaderResponse interface {
	ModifyHeader(h http.Header)
}

type WrappedResponse interface {
	Unwrap() (inner interface{}, err error)
}

type Responder interface {
	// Note: if w is http.ResponseWriter, then HTTP code is written depending on data as well.
	RespondWithData(ctx context.Context, w io.Writer, res interface{}) (err error)
}

type JSONResponder struct{}

func (ld *JSONResponder) RespondWithData(ctx context.Context, w io.Writer, res interface{}) (err error) {
	status := 200
	rw, rwOk := w.(http.ResponseWriter)
	for {

		if rwOk {
			sr, ok := res.(StatusResponse)
			if ok {
				status = sr.GetStatus()
			}
			hr, ok := res.(HeaderResponse)
			if ok {
				hr.ModifyHeader(rw.Header())
			}
		}

		wrapped, ok := res.(WrappedResponse)
		if !ok {
			break
		}

		res, err = wrapped.Unwrap()
		if err != nil {
			return
		}
	}
	if rwOk {
		rw.WriteHeader(status)
	}
	e := json.NewEncoder(w)
	return e.Encode(res)
}
