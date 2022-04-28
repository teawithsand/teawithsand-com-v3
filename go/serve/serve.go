package serve

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/http"
	"sync"

	"github.com/teawithsand/twsblog/util/cfg"
)

func Run() (err error) {
	var config Config

	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}

	if len(config.HTTPListenAddress) == 0 && len(config.HTTPSListenAddress) == 0 {
		err = fmt.Errorf("no address to listen on")
		return
	}

	r, err := MakeRouter(config)
	if err != nil {
		return
	}

	wg := &sync.WaitGroup{}

	s, err := MakeServer(r)
	if err != nil {
		return
	}

	if len(config.HTTPListenAddress) > 0 {

		var l net.Listener
		l, err = net.Listen("tcp", config.HTTPListenAddress)
		if err != nil {
			return
		}

		if len(config.HTTPSListenAddress) > 0 {
			redirectToHTTPS := func(w http.ResponseWriter, req *http.Request) {
				http.Redirect(w, req, "https://"+req.Host+req.RequestURI, http.StatusMovedPermanently)
			}
			srv := &http.Server{
				Handler:           http.HandlerFunc(redirectToHTTPS),
				ReadTimeout:       s.ReadTimeout,
				WriteTimeout:      s.WriteTimeout,
				IdleTimeout:       s.IdleTimeout,
				MaxHeaderBytes:    s.MaxHeaderBytes,
				ReadHeaderTimeout: s.ReadHeaderTimeout,
				BaseContext:       s.BaseContext,
			}

			wg.Add(1)
			go func() {
				defer wg.Done()
				err := srv.Serve(l)
				_ = err
			}()
		} else {
			s := *s // copy server

			wg.Add(1)
			go func() {
				defer wg.Done()
				err := s.Serve(l)
				_ = err
			}()
		}
	}

	if len(config.HTTPSListenAddress) > 0 {
		returnCert := func(helloInfo *tls.ClientHelloInfo) (*tls.Certificate, error) {
			cer, err := tls.LoadX509KeyPair(config.HTTPSCertPath, config.HTTPSPrivateKeyPath)
			if err != nil {
				return nil, err
			}

			return &cer, nil
		}

		var l net.Listener
		l, err = tls.Listen("tcp", config.HTTPSListenAddress, &tls.Config{
			GetCertificate: returnCert,
			MinVersion:     tls.VersionTLS13,
		})
		if err != nil {
			return
		}

		wg.Add(1)
		go func() {
			defer wg.Done()
			err := s.Serve(l)
			_ = err
		}()
	}

	wg.Wait()
	return
}
