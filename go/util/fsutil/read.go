package fsutil

import (
	"bytes"
	"errors"
	"io"
	"os"
)

func ReadFile(fs FS, path string) (data []byte, err error) {
	b := bytes.NewBuffer(nil)

	f, err := fs.Open(path, os.O_RDONLY)
	if err != nil {
		return
	}
	defer f.Close()

	_, err = io.Copy(b, f)
	if err != nil {
		return
	}

	data = b.Bytes()

	return
}

type DataParser struct {
	Parser    func(data []byte, res interface{}) (err error)
	Extension string
}

// Util for loading data from file in multiple formats.
type DataLoader struct {
	Parsers []DataParser
}

func (dl *DataLoader) ReadData(fs FS, path string, res interface{}) (err error) {
	for _, p := range dl.Parsers {
		var data []byte
		data, err = ReadFile(fs, path+"."+p.Extension)
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
