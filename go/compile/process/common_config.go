package process

import "github.com/teawithsand/twsblog/util/fsutil"

type CommonConfig struct {
	OutputFS fsutil.FS
	InputFS  fsutil.FS
}
