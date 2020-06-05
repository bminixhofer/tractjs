#!/usr/bin/env sh

# set -e

# # create new gh-pages branch
# git branch -D gh-pages || true
# git checkout --orphan gh-pages

# build library
cd wrapper
npm run build
cd ..

# build demos
cd demos
npm ci
npm run build
cd ..

# push to gh-pages branch
# git --work-tree dist add -f --all
# git commit -m "deploy" --author="Github Action <action@github.com>"
# git push -f origin HEAD:gh-pages
# git checkout -f master