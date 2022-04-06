package compile

import (
	"time"

	"github.com/teawithsand/twsblog/util/fsutil"
	"github.com/teawithsand/twsblog/util/typescript"
)

type RawPostMetadata struct {
	Title string   `json:"title" toml:"title" yaml:"title"`
	Tags  []string `json:"tags,omitempty" toml:"tags" yaml:"tags"`

	CreatedAt    time.Time  `json:"createdAt" toml:"createdAt" yaml:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty" toml:"lastEditedAt" yaml:"lastEditedAt"`
}

type PostContentEntry struct {
	Type    string            `json:"type" toml:"type" yaml:"type"` // purely informative for renderer, ignored in output
	Tag     string            `json:"tag" toml:"tag" yaml:"tag"`
	Content string            `json:"content" toml:"content" yaml:"content"`
	Props   map[string]string `json:"props,omitempty" toml:"props,omitempty" yaml:"props,omitempty"`
}

type PostContent struct {
	Imports []typescript.Import `json:"imports,omitempty" toml:"imports,omitempty" yaml:"imports,omitempty"`
	Entries []PostContentEntry  `json:"entries" toml:"entries" yaml:"entries"`
}

type RawPost struct {
	Metadata RawPostMetadata
	Content  PostContent
	Dir      string

	PermalinkText string

	FS fsutil.FS
}

type Post struct {
	PostMetadata PostMetadata
	Content      PostContent
	Dir          string

	SrcFs fsutil.FS
	DstFs fsutil.FS
}

type PostMetadata struct {
	UnstableID string `json:"unstableId"`

	Path string `json:"path"`

	Slug string `json:"slug"`

	Title string   `json:"title"`
	Tags  []string `json:"tags"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt"`

	DirName string `json:"dirName"`
}

type ExportedPostMetadata struct {
	UnstableID string `json:"unstableId"`

	Path string `json:"path"`

	Slug string `json:"slug"`

	Title string   `json:"title"`
	Tags  []string `json:"tags"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt"`

	Content string `json:"content"`
}

func (epm ExportedPostMetadata) Summary() SummaryExportedPostMetadata {
	partialContent := epm.Content
	const limit = 150
	if len(partialContent) > limit {
		partialContent = partialContent[:limit]
		partialContent += "..."
	}
	return SummaryExportedPostMetadata{
		UnstableID:     epm.UnstableID,
		Path:           epm.Path,
		Title:          epm.Title,
		Tags:           epm.Tags,
		CreatedAt:      epm.CreatedAt,
		LastEditedAt:   epm.LastEditedAt,
		PartialContent: partialContent,
	}
}

type SummaryExportedPostMetadata struct {
	UnstableID     string     `json:"unstableId"`
	Path           string     `json:"path"`
	Title          string     `json:"title"`
	Tags           []string   `json:"tags"`
	CreatedAt      time.Time  `json:"createdAt"`
	LastEditedAt   *time.Time `json:"lastEditedAt"`
	PartialContent string     `json:"partialContent"`
}

type FullPostData struct {
	Post                 Post
	ExportedPostMetadata ExportedPostMetadata
}
