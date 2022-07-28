#!/bin/env python3

# This script:
# 1. Finds all raw images in content dirs(or given dir)
# 2. Converts all raw images into non-raw versions

import sys
import subprocess
import glob
import os
import os.path

from more_itertools import flatten

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

def main():
    CONTENT_PATH = os.path.realpath(f"{SCRIPT_PATH}/../content")
    print(CONTENT_PATH)


    args = list(sys.argv)[1:]

    for content_dir in glob.glob(CONTENT_PATH + "/*"):
        content_dir = os.path.realpath(content_dir)
        glob_expr = os.path.join(content_dir, "**", "raw_*.jpg")
        print("Finding using", glob_expr)

        for raw_file in glob.glob(glob_expr, recursive=True):
            if ".git" in raw_file:
                continue
            
            out_file = raw_file.replace("raw_", "rdy_", 1)

            if "-ignore" not in args:
                if os.path.exists(out_file):
                    continue

            print("Processing raw file", raw_file, "into", out_file)
            # Resize preserves aspect ratio so 1920x1920 is ok
            subprocess.check_output(f"convert {raw_file} -auto-orient -resize 1920x1920 -strip {out_file}", shell=True)

if __name__ == "__main__":
    main()