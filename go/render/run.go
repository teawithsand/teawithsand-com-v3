package render

import (
	"context"

	"github.com/teawithsand/twsblog/util/cfg"
	"go.uber.org/dig"
)

func Run() (err error) {
	/*
		{
			c := compile.PostContent{
				Imports: []typescript.Import{
					typescript.Import{
						From:    "react",
						Default: "react",
						Others:  []string{"useEffect"},
					},
				},
				Entries: []compile.PostContentEntry{
					{
						Type:    "asdf",
						Tag:     "fdsa",
						Content: "asdf",
						Props: map[string]string{
							"prop": "ok",
						},
					},
					{
						Type:    "other",
						Tag:     "other",
						Content: "other",
						Props: map[string]string{
							"other": "other",
						},
					},
				},
			}

			res, err := yaml.Marshal(c)
			if err != nil {
				panic(err)
			}
			fmt.Println(string(res))
		}
	*/

	ctx := context.Background()

	var config Config
	err = cfg.ReadConfig(&config)
	if err != nil {
		return
	}
	c := dig.New()

	_ = ctx
	_ = c
	return
}
