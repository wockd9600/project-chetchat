const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#fff3e0",

    name: 'ChetChat',
    themeColor: "#ffffff",
    msTileColor: '#3367D6',

    manifestOptions: {
      background_color: "#ffffff",
      start_url: "/",
      display: "standalone",
      short_name: "ChetChat",

      // theme_color: "#3367D6",

      icons: [
        {
          "src": "favicon.ico",
          "type": "image/x-icon"
        },
        {
          "src": "img/icons/48.png",
          "sizes": "48x48",
          "type": "image/png"
        },
        {
          "src": "img/icons/72.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "img/icons/128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "img/icons/192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "img/icons/512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    },
    // iconPaths: {
    //   faviconSVG: 'favicon.ico',
    //   favicon32: 'favicon.ico',
    //   favicon16: 'favicon.ico',
    //   appleTouchIcon: 'favicon.ico',
    //   maskIcon: 'favicon.ico',
    //   msTileImage: 'favicon.ico'
    // },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/favicon-16x16',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: './public/service-worker.js', // service-worker.js 파일 경로
      // swDest: 'service-worker.js', // 빌드된 서비스 워커 파일 경로
      include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/, /\.svg$/, /\.ico$/],
      exclude: [/\.map$/, /manifest\.json$/, /robots\.txt$/],
    },
    chainWebpack: (config) => {
      // 정적 자원 자동 추출
      config.plugin('html').tap((args) => {
        args[0].inject = true;
        return args;
      });
    },
  },
  devServer: {
    allowedHosts: 'all'
  },
})
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     allowedHosts: 'all'
//   },
// })
