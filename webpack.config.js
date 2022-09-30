const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { config } = require("dotenv");

const env = config({ path: resolve(__dirname, "./.env") }).parsed;

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "sinbad";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
        favicon: "./src/favicon.ico",
      }),
      new DefinePlugin({
        NODE_ENV: JSON.stringify(env.NODE_ENV),
        API_HOST: JSON.stringify(env.API_HOST),
        SSC_TOKEN: JSON.stringify(env.SSC_TOKEN),
      }),
    ],
  });
};
