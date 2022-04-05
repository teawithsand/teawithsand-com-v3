package fsutil

import (
	"bytes"
	"io"
	"os"
)

func WriteFile(fs FS, path string, data []byte) (err error) {
	b := bytes.NewBuffer(nil)

	f, err := fs.Open(path, os.O_WRONLY|os.O_TRUNC|os.O_CREATE)
	if err != nil {
		return
	}
	defer f.Close()

	_, err = io.Copy(b, f)
	if err != nil {
		return
	}

	err = f.Close()
	if err != nil {
		return
	}

	return
}
