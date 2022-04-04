package fsutil

import (
	"io"
)

type File interface {
	io.Closer
	io.Reader
	io.Writer
	io.Seeker
}

type Entry interface {
	IsDir() bool
	Name() string
}

type FS interface {
	Open(path string, openMode int) (f File, err error)

	ScanDir(path string) (entries []Entry, err error)
	Copy(source, dst string) (err error)
	Mkdir(path string) (err error)
	Remove(path string) (err error) // also works as RMDIr
	RemoveAll(path string) (err error)
}
