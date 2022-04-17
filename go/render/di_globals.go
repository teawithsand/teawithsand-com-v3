package render

import (
	"encoding/json"
	"encoding/xml"
	"io"

	"github.com/BurntSushi/toml"
	"github.com/teawithsand/handmd/util/encoding"
	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/nonce"
	"github.com/teawithsand/twsblog/util/clean"
	"go.uber.org/dig"
	"gopkg.in/yaml.v2"
)

type JSONEncoderFactory encoding.EncoderFactory
type DataParsers []fsal.DataParser
type UnstableIDGenerator nonce.Generator
type Cleaner clean.Cleaner

func RegisterGlobalsInDI(c *dig.Container) (err error) {
	err = c.Provide(func() (res UnstableIDGenerator, err error) {
		res = &nonce.HexGenerator{
			BytesLength: 16,
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res DataParsers, err error) {
		res = []fsal.DataParser{
			{
				Parser:    json.Unmarshal,
				Extension: "json",
			},
			{
				Parser:    toml.Unmarshal,
				Extension: "toml",
			},
			{
				Parser:    yaml.Unmarshal,
				Extension: "yaml",
			},
			{
				Parser:    yaml.Unmarshal,
				Extension: "yml",
			},
			{
				Parser:    xml.Unmarshal,
				Extension: "xml",
			},
		}
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res JSONEncoderFactory, err error) {
		res = encoding.EncoderFactoryFunc(func(w io.Writer) encoding.Encoder {
			e := json.NewEncoder(w)
			e.SetIndent("", "\t")
			return e
		})
		return
	})
	if err != nil {
		return
	}

	err = c.Provide(func() (res Cleaner, err error) {
		res = clean.NewCleaner()
		return
	})
	if err != nil {
		return
	}

	return
}
