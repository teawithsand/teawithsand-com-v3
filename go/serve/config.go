package serve

type Config struct {
	Env           string `mapstructure:"TWSBLOG_ENV"`
	ListenAddress string `mapstructure:"TWSBLOG_LISTEN_ADDRESS"`
	DebugPath     string `mapstructure:"TWSBLOG_DEBUG_PATH"`
}
