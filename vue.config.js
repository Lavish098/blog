// module.exports = {
//   chainWebpack: (config) => {
//     const svgRule = config.module.rule('svg');

//     svgRule.uses.clear();

//     svgRule
//       .use('vue-loader')
//       .loader('vue-loader')
//       .end()
//       .use('vue-svg-loader')
//       .loader('vue-svg-loader');
//   },
// };

var webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      }),
    ]
  }
}
