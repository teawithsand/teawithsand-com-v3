module.exports = {
	siteMetadata: {
		title: `PalmABooks PWA`,
		siteUrl: `https://www.palmabooks.com`,
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true, // defaults to false
				jsxPragma: `jsx`, // defaults to "React"
				allExtensions: true, // defaults to false
			},
		},
		// Note: brotli is not used for now
		// since nginx does not support it by default
		// and I am to lazy to compile plugin in dockerfile
		// so gzip must be enough
		{
			resolve: "gatsby-plugin-zopfli",
			options: {
				extensions: ["css", "html", "js", "svg", "txt", "json"],
				compression: {
					numiterations: 15,
					blocksplitting: true,
					blocksplittingmax: 15,
				},
			},
		},
		"gatsby-plugin-sass",
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-sitemap",
		"gatsby-plugin-styled-components",
		// TODO(teawithsand): configure this plugin to prevent page switching
		// { resolve: "gatsby-plugin-layout" },
		// { resolve:  },
	],
}
