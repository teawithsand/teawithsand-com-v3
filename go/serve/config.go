package serve

type Config struct {
	Env           string `required:"true" split_words:"true"`
	ListenAddress string `required:"true" split_words:"true"`
	DebugPath     string `split_words:"true"`
}
