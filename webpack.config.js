const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = (env) => {
  const isFirefox = env && env.browser === "firefox";
  const outputPath = isFirefox
    ? path.resolve(__dirname, "dist-firefox")
    : path.resolve(__dirname, "dist-chrome");

  const baseConfig = {
    entry: {
      contentScript: "./src/contentScript.tsx",
      popup: "./src/popup/index.tsx",
      background: "./src/background/index.ts",
    },
    output: {
      filename: "[name].js",
      path: outputPath,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, "styles"),
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/popup.html",
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new CopyPlugin({
        patterns: [
          { from: ".", to: ".", context: "public/static" },
          {
            from: isFirefox ? "manifest.firefox.json" : "manifest.chrome.json",
            to: "manifest.json",
          },
        ],
      }),
    ],
  };

  return baseConfig;
};
