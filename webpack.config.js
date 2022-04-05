const webpack = require("webpack")
const Encore = require('@symfony/webpack-encore');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const StrictCspHtmlWebpackPlugin = require('strict-csp-html-webpack-plugin');

const path = require('path');

const zlib = require("zlib");

const CopyWebpackPlugin = require('copy-webpack-plugin');

const minifier = new ImageMinimizerPlugin({
    minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                    "svgo",
                    /*
                    {
                        plugins: extendDefaultPlugins([
                            {
                                name: "removeViewBox",
                                active: false,
                            },
                            {
                                name: "addAttributesToSVGElement",
                                params: {
                                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                                },
                            },
                        ]),
                    }
                    */,
                ],
            ],
        },
    },
})


// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}


Encore
    // directory where compiled assets will be stored
    .setOutputPath('go/__dist')
    // public path used by the web server to access the output path
    .setPublicPath('/dist/')
    // only needed for CDN or sub-directory deploy
    .setManifestKeyPrefix('dist/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/BlogEntry.tsx')
    // .addEntry('admin', './assets/entry/admin.jsx')
    // .addEntry('externalLogin', './assets/entry/externalLogin.tsx')
    // .addEntry('service-worker', "./assets/entry/serviceWorker.ts")

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    // .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()
    .configureSplitChunks(splitChunks => {
        // make sure that tea-animation and tea-params are separate css files
        // we do not want that big CSS file to slow down page rendering, we prefer having white background
        // while this file loads, rather than making page load longer than required
        splitChunks.chunks = 'all'
        // splitChunks.minSize = 0
        splitChunks.cacheGroups = {
            teaAnimation: {
                test: /(tea-animation|tea-params)\.s?css/,
                reuseExistingChunk: false,
            },
        }
    })

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    // .enableSingleRuntimeChunk()
    // Call this instead, since we are SPA
    .disableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties')
        /*
        config.plugins.push([
            "formatjs",
            {
                "idInterpolationPattern": "[sha512:contenthash:base64:6]",
                "ast": true
            }
        ])
        */
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    .enableSassLoader()
    .enablePostCssLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()

    // uncomment if you use React
    .enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()

    .addPlugin(new HtmlWebpackPlugin({
        // favicon: "assets/images/favicon/favicon.png",
        hash: true,
        title: "teawithsand.com",
    }))
    // .addPlugin(new StrictCspHtmlWebpackPlugin(HtmlWebpackPlugin))

    /*
    .addPlugin(new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        cacheId: "twsblog",
    }))
    */
    /*
    .addPlugin(new CopyWebpackPlugin({
        patterns: [
            {
                from: "assets/generated/combinedMetadata.json",
                to: "metadata.json",
                toType: "template",
            }
        ]
    }))
    */
    .addPlugin(new CompressionPlugin({
        filename: "[path][base].gz",
        test: /\.(js|css|svg|json|html).*$/i,
        threshold: 0,
        algorithm: "gzip",
        compressionOptions: {
            level: 9,
        }
    }))
    .addPlugin(new CompressionPlugin({
        filename: "[path][base].br",
        test: /\.(js|css|svg|json|html).*$/i,
        threshold: 0,
        algorithm: "brotliCompress",
        compressionOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
        },
    }))
    .addPlugin(new BundleAnalyzerPlugin())


    // images are configured manually now
    .configureImageRule({ enabled: false })
    .addRule({
        test: /.svg$/i,
        type: "asset",
    })
    .addRule({
        // TODO(teawithsand): set format to webp, 
        test: /\.(jpe?g|png|webp|gif)$/i,
        use: {
            // https://github.com/dazuaz/responsive-loader
            loader: 'responsive-loader',
            options: {
                esModule: true,
                sizes: [60, 480, 960, 1920, 1920000],
                adapter: require('responsive-loader/sharp')
                // placeholder: true,
                // placeholderSize: 30,
            }
        }
    })
    .addRule({
        test: /.apk$/i,
        type: "asset/resource",
    })
    .addPlugin(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }))
    .configureCssLoader((config) => {
        config.modules = config.modules ?? {}
        config.modules.exportLocalsConvention = "camelCase"
    })
    // TODO(teawithsand): add uglifyjs plugin before compression plugin
    //  and replace webpack default minimizer
    ;

let config = Encore.getWebpackConfig();
config.resolve.plugins = [new TSConfigPathsPlugin];


if (config.optimization.minimizer) {
    config.optimization.minimizer.push(minifier)
} else {
    config.optimization.minimizer = [minifier]
}

config.resolve.fallback = {
    buffer: require.resolve('buffer/'),
}

module.exports = config;
