const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = (env) => {
  if (!env || !env.browser) {
    env = { browser: "chrome" };
  }
  const isSafari = env.browser === "safari";
  let manifest
  let outputPath;
  switch (env.browser) {
    case "firefox":
      manifest = "manifest.firefox.json";
      outputPath = path.resolve(__dirname, "dist-firefox");
      break;
    case "chrome":
      manifest = "manifest.chrome.json";
      outputPath = path.resolve(__dirname, "dist-chrome");
      break;
    case "safari":
      manifest = "manifest.safari.json";
      outputPath = path.resolve(__dirname, "dist-safari");
      break;
    default:
      throw new Error(`Unknown browser: ${env.browser}\nSupported targets are: firefox, chrome, safari`);
  }

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
            from: manifest,
            to: "manifest.json",
          },
        ],
      }),
      ...(!isSafari ? [new ZipPlugin({
        filename: "prompster.zip",
      })] : []),
    ],
  };

  return baseConfig;
};
