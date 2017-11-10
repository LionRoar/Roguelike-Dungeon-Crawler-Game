var path = require('path');
var webpack = require('webpack');
var browserSyncPlugin = require('browser-sync-webpack-plugin');
module.exports = {
// Entry Point
entry:'./src/js/main.js',

//Output point
output:{
  path: path.resolve(__dirname,'dist'),
  filename:'main.js'
},
module:{
  loaders:[
    {
      test:/\.js$/,
      exclude:/(node_modules)/,
      loader:'babel-loader',
      query:{
        presets:['env','react'],
        plugins: ["transform-object-rest-spread"]
      }

    },
    {
      test:/\.sass$/,
      loader:'style-loader!css-loader!sass-loader'
    },
    {
      test:/\.png$/,
      loader:'file-loader?name=[name].[ext]&outputPath=assets/'
    }
  ]
},
plugins:[new webpack.NamedModulesPlugin(),
        new browserSyncPlugin(
                    {
                      host:'localhost',
                      port:3000,
                      proxy:'http://localhost:8101',
                     files: [{
                         match: [
                             '**/*.html'
                         ],
                         fn: function(event, file) {
                             if (event === "change") {
                                 const bs = require('browser-sync').get('bs-webpack-plugin');
                                 bs.reload();
                             }
                         }
                       }]
                    },
                    {
                      reload:false
                    }
        )
]

}
