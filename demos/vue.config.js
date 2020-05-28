module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tract-js/'
    : '/',
  chainWebpack: config => config.resolve.symlinks(false)
}