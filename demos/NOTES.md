# Notes

- Deploy to Github Pages using `../deploy.sh`.
- New subpages (e. g. new demos) have to be added to `../deploy.sh` to be available in Github Pages.
- For requests use the `rURL()` helper function to make them work both locally and in Github Pages.
- The `publicPath` in `vue.config.js` depends on the repository name.