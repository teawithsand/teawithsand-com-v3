package fsutil

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path"
)

func CopyDirectory(fs FS, scrDir, dest string) error {
	entries, err := fs.ReadDir(scrDir)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		sourcePath := path.Join(scrDir, entry.Name())
		destPath := path.Join(dest, entry.Name())

		fileInfo, err := fs.Stat(sourcePath)
		if err != nil {
			return err
		}
		if fileInfo.IsDir() {
			if err := CreateIfNotExists(fs, destPath); err != nil {
				return err
			}
			if err := CopyDirectory(fs, sourcePath, destPath); err != nil {
				return err
			}
		} else {
			if err := Copy(fs, sourcePath, destPath); err != nil {
				return err
			}
		}
	}
	return nil
}

func Copy(fs FS, srcFile, dstFile string) error {
	out, err := fs.Open(dstFile, os.O_WRONLY|os.O_TRUNC|os.O_CREATE)
	if err != nil {
		return err
	}

	defer out.Close()

	in, err := fs.Open(srcFile, os.O_RDONLY)
	if err != nil {
		return err
	}
	defer in.Close()

	_, err = io.Copy(out, in)
	if err != nil {
		return err
	}

	err = out.Close()
	if err != nil {
		return err
	}

	return nil
}

func Exists(fs FS, filePath string) (ok bool, err error) {
	if _, err := os.Stat(filePath); errors.Is(err, os.ErrNotExist) {
		return false, nil
	}

	return err == nil, err
}

func CreateIfNotExists(fs FS, dir string) error {
	exists, err := Exists(fs, dir)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	if err := fs.MkdirAll(dir); err != nil {
		return fmt.Errorf("failed to create directory: '%s', error: '%s'", dir, err.Error())
	}

	return nil
}
