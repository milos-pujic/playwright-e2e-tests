#!/bin/bash

# Create the test-results folder
mkdir -p merged-monocart-report/data

# Array of folder names
folders=(
  "test-results-firefox-1_2"
  "test-results-firefox-2_2"
  "test-results-chromium-1_2"
  "test-results-chromium-2_2"
  "test-results-webkit-1_2"
  "test-results-webkit-2_2"
)

# Iterate over the array and copy contents if the folder exists
for folder in "${folders[@]}"; do
  if [ -d "$folder" ]; then
    cp -r "$folder"/* merged-monocart-report/data/
  fi
done