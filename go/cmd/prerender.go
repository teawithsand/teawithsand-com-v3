/*
Copyright © 2022 teawithsand <teawithsand@gmail.com>

*/
package cmd

import (
	"github.com/spf13/cobra"
)

// prerenderCmd represents the prerender command
var prerenderCmd = &cobra.Command{
	Use:   "prerender",
	Short: "Prerenders assets into static HTML files",
	Long:  `It's useful for SEO`,
	Run: func(cmd *cobra.Command, args []string) {
		panic("prerendering is NIY")
	},
}

func init() {
	rootCmd.AddCommand(prerenderCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// prerenderCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// prerenderCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
