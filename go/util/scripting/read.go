package scripting

import (
	"errors"
	"os"
)

type DataParser struct {
	Parser    func(data []byte, res interface{}) (err error)
	Extension string
}

type DataLoader struct {
	Parsers []DataParser
}

// Reads file at provided path and deserializes content into res.
func (dl *DataLoader) ReadData(path string, res interface{}) (err error) {
	for _, p := range dl.Parsers {
		var data []byte
		data, err = os.ReadFile(path + "." + p.Extension)
		if errors.Is(err, os.ErrNotExist) {
			err = nil
			continue
		}

		err = p.Parser(data, res)
		if err != nil {
			return
		}
		return
	}

	err = os.ErrNotExist
	return
}

type RawDataLoader struct {
	Extensions []string
}

// Reads file at provided path and deserializes content into res.
func (rdl *RawDataLoader) ReadData(path string) (res []byte, resExt string, err error) {
	for _, ext := range rdl.Extensions {
		var data []byte
		data, err = os.ReadFile(path + "." + ext)
		if errors.Is(err, os.ErrNotExist) {
			err = nil
			continue
		}

		res = data
		resExt = ext
		return
	}

	err = os.ErrNotExist
	return
}
