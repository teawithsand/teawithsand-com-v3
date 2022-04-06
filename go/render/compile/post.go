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
	Type    string            `json:"type" toml:"type" yaml:"type"`
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
	Tags  []string `json:"tags,omitempty"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty"`

	DirName string `json:"dirName,omitempty"`
}

type ExportedPostMetadata struct {
	UnstableID string `json:"unstableId"`

	Path string `json:"path"`

	Slug string `json:"slug"`

	Title string   `json:"title"`
	Tags  []string `json:"tags,omitempty"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty"`
}

type FullPostData struct {
	Post                 Post
	ExportedPostMetadata ExportedPostMetadata
}
