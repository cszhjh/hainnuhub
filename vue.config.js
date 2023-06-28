const { defineConfig } = require("@vue/cli-service");

const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://47.120.15.88:8000",
        pathRewrite: {
          "^/api": ""
        },
        changeOrigin: true
      }
    },
    client: {
      overlay: {
        runtimeErrors: false
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        components: "@/components",
        assets: "@/assets"
      }
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Hainnuhub";
      return args;
    });
  }
});
