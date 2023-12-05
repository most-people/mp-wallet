const webpack = require("webpack")

module.exports = function override(config, env) {
    // 添加polyfill
    config.resolve.fallback = {
        ...config.resolve.fallback, // 保持现有的fallback配置
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        // assert: require.resolve("assert"),
        // http: require.resolve("stream-http"),
        // https: require.resolve("https-browserify"),
        // os: require.resolve("os-browserify"),
        // url: require.resolve("url"),
        // util: require.resolve("util/"),
        buffer: require.resolve("buffer"),
    };
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    return config;
};