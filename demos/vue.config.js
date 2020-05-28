module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  chainWebpack: config => config.resolve.symlinks(false)
}