package fsutil

import (
	"bytes"
	"io"
	"os"
)

func WriteFile(fs FS, path string, data []byte) (err error) {
	b := bytes.NewBuffer(data)

	f, err := fs.Open(path, os.O_WRONLY|os.O_TRUNC|os.O_CREATE)
	if err != nil {
		return
	}
	defer f.Close()

	_, err = io.Copy(f, b)
	if err != nil {
		return
	}

	err = f.Close()
	if err != nil {
		return
	}

	return
}

func WriteFileStream(fs FS, path string, r io.Reader) (err error) {
	f, err := fs.Open(path, os.O_WRONLY|os.O_TRUNC|os.O_CREATE)
	if err != nil {
		return
	}
	defer f.Close()

	_, err = io.Copy(f, r)
	if err != nil {
		return
	}

	err = f.Close()
	if err != nil {
		return
	}

	return
}
