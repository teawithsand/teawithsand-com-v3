package cfg

import "github.com/kelseyhightower/envconfig"

func ReadConfig(res interface{}) (err error) {
	err = envconfig.Process("TWSBLOG", res)
	return
}
