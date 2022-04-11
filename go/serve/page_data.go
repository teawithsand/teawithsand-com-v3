package serve

import (
	"context"
	"encoding/json"
	"os"

	"github.com/teawithsand/handmd/util/fsal"
	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/handmd/util/simplesite"
	"github.com/teawithsand/handmd/util/webpackparse"
	"github.com/teawithsand/twsblog/render"
	"github.com/teawithsand/twsblog/render/defines"
)

type PageData struct {
	Endpoints   defines.Endpoints
	Entrypoints webpackparse.EntrypointsJSONDoc
}

func (pd *PageData) GetHTTP2PushEntries(ctx context.Context, entrypoint string) (res []string, err error) {
	pd.Entrypoints.
		StylesIterable(entrypoint).
		Iterate(ctx, iter.Receiver[webpackparse.EPEntry](func(ctx context.Context, entry webpackparse.EPEntry) (err error) {
			res = append(res, entry.Src)
			return
		}))
	if err != nil {
		return
	}

	pd.Entrypoints.
		ScriptsIterable(entrypoint).
		Iterate(ctx, iter.Receiver[webpackparse.EPEntry](func(ctx context.Context, entry webpackparse.EPEntry) (err error) {
			res = append(res, entry.Src)
			return
		}))
	if err != nil {
		return
	}

	return
}

func (pd *PageData) GetHTMLRenderData(ctx context.Context, entrypoint string) (data render.RenderHTMLData, err error) {
	data.HeadTags = append(data.HeadTags, simplesite.HTMLTag{
		Name:    "title",
		Content: "teawithsand.com",
	})

	err = pd.Entrypoints.
		StylesIterable(entrypoint).
		Iterate(ctx, iter.Receiver[webpackparse.EPEntry](func(ctx context.Context, entry webpackparse.EPEntry) (err error) {
			data.HeadTags = append(data.HeadTags, simplesite.HTMLTag{
				Name: "link",
				Attributes: []simplesite.HTMLAttribute{
					{
						Name:  "href",
						Value: entry.Src,
					},
					{
						Name:  "rel",
						Value: "stylesheet",
					},
				},
				Close: simplesite.NoTagClose,
			})
			return
		}))
	if err != nil {
		return
	}

	err = pd.Entrypoints.
		ScriptsIterable(entrypoint).
		Iterate(ctx, iter.Receiver[webpackparse.EPEntry](func(ctx context.Context, entry webpackparse.EPEntry) (err error) {
			data.HeadTags = append(data.HeadTags, simplesite.HTMLTag{
				Name: "script",
				Attributes: []simplesite.HTMLAttribute{
					{
						Name:  "src",
						Value: entry.Src,
					},
				},
				RawAttributes: []string{
					"defer",
				},
				Close: simplesite.SimpleTagClose,
			})
			return
		}))
	if err != nil {
		return
	}

	return
}

type PageDataLoader struct {
	DataFS fsal.FS
}

func (pdl *PageDataLoader) LoadData(ctx context.Context) (data PageData, err error) {
	f, err := pdl.DataFS.Open("all_endpoints.json", os.O_RDONLY)
	if err != nil {
		return
	}
	defer f.Close()

	err = json.NewDecoder(f).Decode(&data.Endpoints)
	if err != nil {
		return
	}

	f.Close()

	f, err = pdl.DataFS.Open("entrypoints.json", os.O_RDONLY)
	if err != nil {
		return
	}
	defer f.Close()

	err = json.NewDecoder(f).Decode(&data.Entrypoints)
	if err != nil {
		return
	}

	f.Close()

	return
}
