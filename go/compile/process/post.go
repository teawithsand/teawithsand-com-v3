package process

import "time"

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
	Entries []PostContentEntry `json:"entries" toml:"entries" yaml:"entries"`
}

type RawPost struct {
	Metadata RawPostMetadata
	Content  PostContent
	Dir      string
}

type Post struct {
	PostMetadata
	Content PostContent
	Dir     string
}

type PostMetadata struct {
	Path string `json:"path"`

	Title string   `json:"title"`
	Tags  []string `json:"tags,omitempty"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty"`
}
