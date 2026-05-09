#!/bin/bash

usage()
{
  echo "Usage: $0 pgn out_file"
  exit 1
}

if [ $# -ne 2 ]
then
  usage
else
  PGN=$1
  OUT_FILE=$2
fi

RESULT=""
for FILE in reduced/*
do
  FILE_NAME=$(basename $FILE)
  echo "Starting $FILE_NAME"

  FILTERED=$(grep -e "$PGN" $FILE)
  RESULT="$RESULT$FILTERED\n"

  echo "  $FILE_NAME completed!"
done

printf "$RESULT" > $OUT_FILE