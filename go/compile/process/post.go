package process

import "time"

type RawPostMetadata struct {
	Title string   `json:"title"`
	Tags  []string `json:"tags,omitempty"`

	CreatedAt    time.Time  `json:"createdAt"`
	LastEditedAt *time.Time `json:"lastEditedAt,omitempty"`
}

type RawPost struct {
	Metadata RawPostMetadata
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
