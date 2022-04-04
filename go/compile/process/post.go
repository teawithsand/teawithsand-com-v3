package process

import "time"

type RawPostMetadata struct {
	Title string   `json:"title" toml:"title"`
	Tags  []string `json:"tags,omitempty" toml:"tags"`

	CreatedAt    time.Time  `json:"createdAt" toml:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty" toml:"lastEditedAt"`
}

type RawPostContent struct {
	Content []byte
	Kind    string
}

type RawPost struct {
	Metadata RawPostMetadata
	Content  RawPostContent
	Dir      string
}

type Post struct {
	PostMetadata
	Dir string
}

type PostMetadata struct {
	Path string `json:"path"`

	Title string   `json:"title"`
	Tags  []string `json:"tags,omitempty"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty"`
}
