/*
Copyright © 2022 teawithsand <teawithsand@gmail.com>

*/
package cmd

import (
	"errors"
	"log"
	"net/http"

	"github.com/spf13/cobra"
	"github.com/teawithsand/twsblog/serve"
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "A brief description of your command",
	Long:  `Starts application server`,
	Run: func(cmd *cobra.Command, args []string) {
		log.Default().Println("Running server...")
		err := serve.Run()
		if errors.Is(err, http.ErrServerClosed) {
			return
		} else if err != nil {
			panic(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
