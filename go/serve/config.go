package serve

type Config struct {
	Env               string `mapstructure:"TWSBLOG_ENV"`
	HTTPListenAddress string `mapstructure:"TWSBLOG_HTTP_LISTEN_ADDRESS"`
	DebugPath         string `mapstructure:"TWSBLOG_DEBUG_PATH"`

	HTTPSListenAddress  string `mapstructure:"TWSBLOG_HTTPS_LISTEN_ADDRESS"`
	HTTPSCertPath       string `mapstructure:"TWSBLOG_HTTPS_CERT_PATH"`
	HTTPSPrivateKeyPath string `mapstructure:"TWSBLOG_HTTPS_KEY_PATH"`
}
