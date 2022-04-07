package scripting

import (
	"context"
	"io"
	"os"
	"os/exec"
)

type Command struct {
	Command string
	Args    []string

	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer
}

func (c *Command) Exec(ctx context.Context) (err error) {
	cmd := exec.Command(c.Command, c.Args...)
	cmd.Stdout = c.Stdout
	cmd.Stdin = c.Stdin
	cmd.Stderr = os.Stderr

	err = cmd.Run()
	if err != nil {
		return
	}

	/*
		err = cmd.Wait()
		if err != nil {
			return
		}

		if cmd.ProcessState.ExitCode() != 0 {
			err = fmt.Errorf("util/scripting: NZEC: %d from %s with args %v", cmd.ProcessState.ExitCode(), c.Command, c.Args)
			return
		}
	*/

	return
}
