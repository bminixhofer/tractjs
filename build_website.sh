#!/usr/bin/env sh

set -e

# build library
cd wrapper
npm run build
cd ..

# build demos
cd demos
npm ci
npm run build
cd ..

# move to directory resembling website structure
mkdir build
mv demos/dist/* build/
mv wrapper/docs/ build/docs/
