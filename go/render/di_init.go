package render

import (
	"context"
	"fmt"
	"path"

	"github.com/teawithsand/handmd/compile/renderer"
	"github.com/teawithsand/handmd/util/iter"
	"github.com/teawithsand/twsblog/render/defines"
	"go.uber.org/dig"
)

func InitDI(c *dig.Container) (err error) {
	err = RegisterGlobalsInDI(c)
	if err != nil {
		return
	}

	err = RegisterPostLoadersInDI(c)
	if err != nil {
		return
	}

	err = RegisterGlobalLoadersInDI(c)
	if err != nil {
		return
	}

	err = RegisterDefinesInDI(c)
	if err != nil {
		return
	}

	err = RegisterPostRenderers(c)
	if err != nil {
		return
	}

	err = RegisterGlobalRenderers(c)
	if err != nil {
		return
	}

	err = RegisterCommandInDI(c)
	if err != nil {
		return
	}

	return
}

func DIPerformRender(c *dig.Container) (err error) {
	err = c.Invoke(func(
		ctx context.Context,
		output OutputFileSystem,
		input InputFileSystem,

		eps Endpoints,
		posts Posts,
		exportedPostMetadatas ExportedPostMetadatas,
		summaryExportedPostMetadatas SummaryExportedPostsMetadatas,

		cr CleanRenderer,
		pr PostRenderer,

		smr SummaryExportedMetadataRenderer,
		epr AllEndpointsRenderer,
		tsr TsIndexRenderer,
		fir FuseIndexRenderer,
	) (err error) {
		err = cr.Render(ctx, struct{}{}, output)
		if err != nil {
			return
		}

		err = pr.Render(ctx, posts, output)
		if err != nil {
			return
		}

		collectedExportedPostMetadatas, err := iter.Collect[defines.SummaryExportedPostMetadata](ctx, summaryExportedPostMetadatas)
		if err != nil {
			return
		}

		err = smr.Render(ctx, collectedExportedPostMetadatas, output)
		if err != nil {
			return
		}

		tsEntries, err := iter.Collect(ctx, iter.Map[defines.Post](posts, func(ctx context.Context, data defines.Post) (res map[string]string, err error) {
			res = map[string]string{
				"component": fmt.Sprintf("() => import(\"./%s\")", path.Join(data.PostMetadata.DirName, "Post")),
				"path":      fmt.Sprintf("\"%s\"", data.PostMetadata.Path),
			}
			return
		}))
		if err != nil {
			return
		}

		err = tsr.Render(ctx, renderer.TSIndexRenderData{
			Entries: iter.Slice(tsEntries),
		}, output)
		if err != nil {
			return
		}

		err = epr.Render(ctx, defines.Endpoints(eps), output)
		if err != nil {
			return
		}

		metadataEntries, err := iter.Collect[defines.ExportedPostMetadata](ctx, exportedPostMetadatas)
		if err != nil {
			return
		}

		err = fir.Render(ctx, metadataEntries, output)
		if err != nil {
			return
		}

		return
	})
	return
}
