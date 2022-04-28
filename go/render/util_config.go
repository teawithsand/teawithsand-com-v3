package render

type Config struct {
	EmitPath    string `mapstructure:"TWSBLOG_EMIT_PATH"`
	SourcePath  string `mapstructure:"TWSBLOG_SOURCE_PATH"`
	ScriptsPath string `mapstructure:"TWSBLOG_SCRIPTS_PATH"`
}
