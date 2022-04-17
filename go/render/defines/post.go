package defines

import (
	"strings"
	"time"

	"github.com/teawithsand/handmd/util/fsal"
)

type Post struct {
	PostMetadata PostMetadata
	Content      PostContent

	SrcFS fsal.FS
}

type PostMetadata struct {
	UnstableID string `json:"unstableId"`

	Path string `json:"path"`

	Slug string `json:"slug"`

	Title string   `json:"title"`
	Tags  []string `json:"tags"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt"`

	// Name of post's directory
	DirName string `json:"dirName"`
}

func (post Post) Exported() ExportedPostMetadata {
	var content string

	for _, e := range post.Content.Entries {
		content += e.Content + "\n"
	}

	content = strings.TrimSpace(content)

	me := post.PostMetadata
	return ExportedPostMetadata{
		UnstableID:   me.UnstableID,
		Path:         me.Path,
		Slug:         me.Slug,
		Title:        me.Title,
		Tags:         me.Tags,
		CreatedAt:    me.CreatedAt,
		LastEditedAt: me.LastEditedAt,
		Content:      content,
	}
}
