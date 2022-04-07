package serve

import (
	"net"
)

func Run() (err error) {
	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}
	r, err := MakeRouter(config)
	if err != nil {
		return
	}

	s, err := MakeServer(r)
	if err != nil {
		return
	}
	l, err := net.Listen("tcp", config.ListenAddress)
	if err != nil {
		return
	}

	err = s.Serve(l)
	return
}
