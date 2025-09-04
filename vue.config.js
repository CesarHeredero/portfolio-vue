const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  productionSourceMap: false,
  css: {
    extract: true,
    sourceMap: false
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'César Heredero - Portfolio'
      args[0].meta = {
        description: 'Portfolio profesional de César Heredero - UX/UI Designer & Frontend Developer',
        keywords: 'UX, UI, diseño, desarrollo web, frontend, portfolio'
      }
      return args
    })
  }
})
