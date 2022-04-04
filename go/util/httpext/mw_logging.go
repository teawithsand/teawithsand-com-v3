package httpext

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"runtime/debug"
	"time"

	"github.com/teawithsand/twsblog/util/cext"
)

type responseWriter struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

func wrapResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{ResponseWriter: w}
}

func (rw *responseWriter) Status() int {
	return rw.status
}

func (rw *responseWriter) WriteHeader(code int) {
	if rw.wroteHeader {
		return
	}

	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
	rw.wroteHeader = true
}

// LoggingMiddleware logs the incoming HTTP request & its duration.
func LoggingMiddleware(logger *log.Logger) Middleware {
	if logger == nil {
		logger = log.Default()
	}

	return MiddlewareFunc(func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					// TODO(teawithsand): pretty 500 error page
					w.WriteHeader(http.StatusInternalServerError)

					logger.Println(
						"err", err,
						"trace",
					)

					fmt.Println("====STACK TRACE BEGIN====")
					fmt.Println("Message:", err)
					debug.PrintStack()
					fmt.Println("====STACK TRACE END====")
				}
			}()

			requestErr := cext.Error(r.Context())
			if requestErr == nil {
				requestErr = errors.New("<nil>")
			}

			start := time.Now()
			wrapped := wrapResponseWriter(w)
			next.ServeHTTP(wrapped, r)
			logger.Println(
				"status", wrapped.status,
				"method", r.Method,
				"path", r.URL.EscapedPath(),
				"duration", time.Since(start),
				"reportedError", requestErr.Error(),
			)
		}

		return http.HandlerFunc(fn)
	})
}
