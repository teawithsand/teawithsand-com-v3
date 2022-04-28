package defines

import (
	"time"

	"github.com/teawithsand/handmd/util/fsal"
)

type RawPostMetadata struct {
	Title string   `json:"title" toml:"title" yaml:"title"`
	Tags  []string `json:"tags,omitempty" toml:"tags" yaml:"tags"`
	Skip  bool     `json:"skip" toml:"skip" yaml:"skip"`

	CreatedAt    time.Time  `json:"createdAt" toml:"created_at" yaml:"created_at"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty" toml:"last_edited_at" yaml:"last_edited_at"`
}

type RawPost struct {
	Metadata RawPostMetadata
	Content  PostContent
	Dir      string

	PermalinkText string

	// SrcFS, which contains post's data
	SrcFS fsal.FS
}
