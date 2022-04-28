package cfg

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

func init() {
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	viper.SetConfigName(".env") // name of config file (without extension)
	viper.SetConfigType("env")  // REQUIRED if the config file does not have the extension in the name

	viper.SetEnvPrefix("TWSBLOG")
	viper.AutomaticEnv()

	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
}

func ReadConfig(res interface{}) (err error) {
	err = viper.Unmarshal(&res)
	if err != nil {
		return
	}

	log.Printf("%+#v\n", res)

	return
}
