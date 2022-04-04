package testutil

import (
	"flag"
	"sync/atomic"
)

var globalTestOverride = int32(0)

func IsTest() bool {
	v := atomic.LoadInt32(&globalTestOverride)
	return v != 0 || flag.Lookup("test.v") != nil
}

func SetTestENV() {
	atomic.StoreInt32(&globalTestOverride, 1)
}
