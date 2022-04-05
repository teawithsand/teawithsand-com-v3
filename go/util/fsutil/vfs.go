package fsutil

import (
	"io"
)

type File interface {
	io.Closer
	io.Reader
	io.Writer
	io.Seeker
	io.ReaderAt
	io.WriterAt
}

type Entry interface {
	IsDir() bool
	Name() string
}

type FS interface {
	Open(path string, openMode int) (f File, err error)

	ReadDir(path string) (entries []Entry, err error)
	Rename(from, to string) (err error)
	Mkdir(path string) (err error)
	MkdirAll(path string) (err error)
	Remove(path string) (err error) // also works as RMDIr
	RemoveAll(path string) (err error)
	Stat(path string) (e Entry, err error)
}
