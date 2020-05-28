#!/usr/bin/env sh

set -e

git checkout gh-pages
npm run build

# add subpages
cp -a dist/index.html dist/squeezenet.html

git --work-tree dist add --all
git --work-tree dist commit -m "deploy"
git push origin gh-pages
git checkout -f master