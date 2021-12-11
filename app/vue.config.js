module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: 'http://127.0.0.1:8000/',
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/scss/style.scss"'
      }
    }
  }
}
