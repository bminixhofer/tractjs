#!/usr/bin/env sh

# git checkout gh-pages && git checkout --orphan gh-pages
# # remove last build
# rm -rf *
# # check out current directory on master branch
# git checkout master -- .

# build library
source build.sh

# build docs
cd wrapper
DOC_DIR="../docs" npm run build-docs
cd ..

# build demos
cd demos
npm ci
npm run build

## add subpages
cp -a dist/index.html dist/squeezenet.html
cp -a dist/index.html dist/custom-model.html

cd ..

# push to gh-pages branch
# git --work-tree dist add -f --all
# git commit -m "deploy" --author="Github Action <action@github.com>"
# git push -f origin HEAD:gh-pages
# git checkout -f master