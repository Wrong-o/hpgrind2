#!/bin/bash

# Create js-src directory if it doesn't exist
mkdir -p js-src

# Copy all files to js-src
cp -r src/* js-src/

# Convert TypeScript files to JavaScript
find js-src -name "*.tsx" -exec sh -c 'npx babel "$1" --out-file "${1%.tsx}.jsx" && rm "$1"' _ {} \;
find js-src -name "*.ts" -exec sh -c 'npx babel "$1" --out-file "${1%.ts}.js" && rm "$1"' _ {} \;

# Remove type definition files
find js-src -name "*.d.ts" -delete

echo "Conversion complete! JavaScript files are in the js-src directory" 