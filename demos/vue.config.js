module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tractjs/'
    : '/',
  chainWebpack: config => config.resolve.symlinks(false)
}