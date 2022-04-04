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
func (dr *DataLoader) ReadData(path string, res interface{}) (err error) {
	for _, p := range dr.Parsers {
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
