package compile

import "io"

func ExtractPostContentText(entries []PostContentEntry, w io.Writer) (err error) {
	isFirst := true
	for _, e := range entries {
		if len(e.Content) == 0 {
			continue
		}

		// In general, write all content that may be here
		// Images or stuff are passed by props, rather than content, so it's ok.
		_, err = w.Write([]byte(e.Content))
		if err != nil {
			return
		}

		if !isFirst {
			_, err = w.Write([]byte("\n"))
			if err != nil {
				return
			}
		}

		isFirst = false
	}
	return
}
