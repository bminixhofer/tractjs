#!/usr/bin/env sh

git checkout gh-pages && git checkout --orphan gh-pages
# remove last build
rm -rf *
# check out current directory on master branch
git checkout master -- .

# build
wasm-pack build --release
cd demos
npm ci
npm run build

# add subpages
cp -a dist/index.html dist/squeezenet.html

git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"

git --work-tree dist add -f --all
git commit -m "deploy"
git push -f origin HEAD:gh-pages
git checkout -f master