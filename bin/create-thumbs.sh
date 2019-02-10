#!/bin/bash

if [ ! -e "$1" ]; then
  echo 'Path does not exist'
  exit
fi

# create thumbs folders: 10, 200, 400, 600
function create_folders {
  for i in 9 180 360 600
    do mkdir -p "$1/thumbnails/$i"
  done
}
export -f create_folders

# count number of images under a folder
function total_images {
  find "$1" \
    -maxdepth 1 \
    -regextype posix-extended \
    -regex '^.*\.(jpg|png|gif|bmp|webp)$' | wc -l;
}
export -f total_images

# convert images to thumbs
function create_thumbnails {
  file_name=$( basename "$1")
  file_path=$( dirname "$1")

  for i in 9 180 360 600; do
    height=$(( i*4/3 ))
    convert "$1" -resize ${i}x${height}\> "$file_path/thumbnails/$i/$file_name"
  done

  echo "Complete creating thumbnails for $1"
}
export -f create_thumbnails

# scan and create thumbnails for images inside folder
function process_a_folder {
  if [[ "$1" =~ .*thumbnails.* ]]; then
    return 1
  fi

  image_count=$( total_images "$1" )

  if [ $image_count -gt 0 ]; then
    create_folders "$1"

    find "$1" \
      -maxdepth 1 \
      -regextype posix-extended \
      -regex '^.*\.(jpg|png|gif|bmp)$' \
      -exec bash -c 'create_thumbnails "$0"' {} \;
  fi
}
export -f process_a_folder

find "$1" \
  -type d \
  -exec bash -c 'process_a_folder "$0"' {} \;
