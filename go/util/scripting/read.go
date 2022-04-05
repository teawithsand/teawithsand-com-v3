package scripting

import (
	"errors"
	"io/fs"
	"os"

	"github.com/teawithsand/twsblog/util/fsutil"
)

type DataParser struct {
	Parser    func(data []byte, res interface{}) (err error)
	Extension string
}

type DataLoader struct {
	FS      fsutil.FS
	Parsers []DataParser
}

// Reads file at provided path and deserializes content into res.
func (dl *DataLoader) ReadData(path string, res interface{}) (err error) {
	for _, p := range dl.Parsers {
		var data []byte
		data, err = fs.ReadFile(path + "." + p.Extension)
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
