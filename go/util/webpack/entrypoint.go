package webpack

import (
	"encoding/json"
)

type topLevelDoc struct {
	Entrypoints Entrypoints `json:"entrypoints"`
}

type Entrypoints struct {
	App Entrypoint `json:"app"`
}

type Entrypoint struct {
	Js  []string `json:"js"`
	Css []string `json:"css"`
}

func ParseEntrypointsJSON(data []byte) (eps Entrypoints, err error) {
	var loadDoc topLevelDoc
	err = json.Unmarshal(data, &loadDoc)
	if err != nil {
		return
	}

	eps = loadDoc.Entrypoints
	return
}

type AddOptions struct {
	Nonce string
	Async bool
	Defer bool
}

func (ep *Entrypoint) AddToData(opts AddOptions, target *Data) {
	for _, js := range ep.Js {
		target.Scripts = append(target.Scripts, Script{
			Src:   js,
			Nonce: opts.Nonce,
			Async: opts.Async,
			Defer: opts.Defer,
		})
	}

	for _, css := range ep.Css {
		target.Links = append(target.Links, Link{
			Rel:   "stylesheet",
			Href:  css,
			Nonce: opts.Nonce,
		})
	}
}
