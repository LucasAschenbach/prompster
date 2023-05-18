const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = (env) => {
  if (!env || !env.browser) {
    env = { browser: "chrome" };
  }
  const isFirefox = env.browser === "firefox";
  let outputPath;
  switch (env.browser) {
    case "firefox":
      outputPath = path.resolve(__dirname, "dist-firefox");
      break;
    case "chrome":
      outputPath = path.resolve(__dirname, "dist-chrome");
      break;
    case "safari":
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
            from: isFirefox ? "manifest.firefox.json" : "manifest.chrome.json",
            to: "manifest.json",
          },
        ],
      }),
      ...(isFirefox ? [new ZipPlugin({
        filename: "prompster.zip",
      })] : []),
    ],
  };

  return baseConfig;
};
