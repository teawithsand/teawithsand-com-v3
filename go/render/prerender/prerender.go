package prerender

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/handmd/util/scripting"
)

type PrerenderConfig struct {
	CommandFactory scripting.CommandFactory
	CommandName    string

	PrerenderServerAddress string
	GetWriter              func(path string) io.WriteCloser

	LocalServer     *http.Server
	ListenerFactory func(ctx context.Context) (net.Listener, error)

	PrerenderServerPort int
}

func (cfg *PrerenderConfig) PrerenderPaths(ctx context.Context, paths iter.Iterable[string]) (err error) {
	client := &http.Client{
		Timeout: time.Second * 30,
	}

	cmd, err := cfg.CommandFactory.GetCommand(ctx, cfg.CommandName)
	if err != nil {
		return
	}
	cmd.EnvVars["PORT"] = fmt.Sprintf("%d", cfg.PrerenderServerPort)

	wg := sync.WaitGroup{}
	defer wg.Wait()

	cmdCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	// 1. Start prerender server
	wg.Add(1)
	go func() {
		defer wg.Done()
		cmd.Exec(cmdCtx)
	}()

	l, err := cfg.ListenerFactory(ctx)
	if err != nil {
		return
	}
	defer l.Close()

	serverAddr := l.Addr().String()

	// 2. Start local server
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := cfg.LocalServer.Serve(l)
		_ = err
	}()

	time.Sleep(time.Second * 3) // wait for stuff to initialize, should do for now

	err = paths.Iterate(ctx, iter.Receiver[string](func(ctx context.Context, path string) (err error) {
		innerPath := url.URL{
			Scheme: "http",
			Host:   serverAddr,
			Path:   path,
		}

		targetPath := url.URL{
			Scheme:   "http",
			Host:     fmt.Sprintf("localhost:%d", cfg.PrerenderServerPort),
			Path:     "/render",
			RawQuery: "url=" + url.PathEscape(innerPath.String()),
		}

		r, err := http.NewRequestWithContext(ctx, "GET", targetPath.String(), nil)
		if err != nil {
			return
		}

		res, err := client.Do(r)
		if err != nil {
			return
		}
		defer res.Body.Close()

		target := cfg.GetWriter(path)
		defer target.Close()

		_, err = io.Copy(target, res.Body)
		if err != nil {
			return
		}

		err = target.Close()
		if err != nil {
			return
		}

		return
	}))
	if err != nil {
		return
	}
	return
}
