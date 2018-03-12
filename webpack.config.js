var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(env) {
    return buildGossluzhba();
}

function buildGossluzhba() {
    const PATH = './gossluzhba';
    const OUTPUT = 'compile/gossluzhba'

    return {
        entry: {
            background: `${PATH}/assets/js/background.js`,
            exports: `${PATH}/assets/js/app.jsx`
        },
        output: {
            filename: `${OUTPUT}/assets/js/[name].js`
        },
        plugins: [
            new ExtractTextPlugin(`${OUTPUT}/[name].css`),
            new CopyWebpackPlugin([{
                    from: `${PATH}/manifest.json`,
                    to: `./${OUTPUT}/`
                },
                {
                    from: `${PATH}/assets/css`,
                    to: `./${OUTPUT}/assets/css`
                },
                {
                    from: `${PATH}/assets/img`,
                    to: `./${OUTPUT}/assets/img`
                },
                {
                    from: `${PATH}/exports.html`,
                    to: `./${OUTPUT}/`
                }
            ]),
            new CleanWebpackPlugin([`${OUTPUT}`]),
            new webpack.optimize.OccurrenceOrderPlugin()
        ],
        module: {
            loaders: [{
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }]
        }
    }
}