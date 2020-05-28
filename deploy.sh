#!/usr/bin/env sh

set -e

git checkout gh-pages
# remove last build
rm -r *
# check out current directory on master branch
git checkout master -- .

# build
wasm-pack build --release
cd demos
npm run build

# add subpages
cp -a dist/index.html dist/squeezenet.html

git --work-tree dist add -f --all
git commit -m "deploy"
git push -f origin gh-pages
git checkout -f master