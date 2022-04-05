/*
Copyright © 2022 teawithsand <teawithsand@gmail.com>

*/
package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/teawithsand/twsblog/render"
)

// generateCmd represents the generate command
var generateCmd = &cobra.Command{
	Use:   "render",
	Short: "Render blog post indexes",
	Long:  `Renders client-side routing scheme for blog post indexes.`,
	Run: func(cmd *cobra.Command, args []string) {
		log.Println("Running blog post compilation...")
		err := render.Run()
		if err != nil {
			panic(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(generateCmd)
}
