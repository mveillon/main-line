#!/bin/bash

for FILE in chunks/*
do
  FILE_NAME=$(basename $FILE)
  OUT_FILE="reduced/$FILE_NAME"

  (
    sed -e '/[{][^}]*[}]/ s///g' $FILE |
    grep -v "[[][^]]*[]]" |
    sed -E "/[0-9]+[\.]{3}/ s///g" |
    tr -s ' ' |
    grep -e "\S" > $OUT_FILE
  )
  echo "$FILE_NAME completed"
done

