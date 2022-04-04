package scripting

import "path"

type Collection struct {
	Dir string
}

func (sd *Collection) GetCommand(scriptName string, args []string) (cmd *Command, err error) {
	res := path.Join(sd.Dir, scriptName)

	cmd = &Command{}
	cmd.Command = res
	cmd.Args = args
	return
}
