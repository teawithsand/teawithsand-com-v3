package compile

type Config struct {
	EmitPath    string `required:"true" split_words:"true"`
	SourcePath  string `required:"true" split_words:"true"`
	ScriptsPath string `required:"true" split_words:"true"`
}
