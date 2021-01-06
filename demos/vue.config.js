module.exports = {
  transpileDependencies: [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tractjs/'
    : '/',
  chainWebpack: config => {
    config.resolve.symlinks(false);
    config.module.rule('raw')
      .test(/\.md$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
}