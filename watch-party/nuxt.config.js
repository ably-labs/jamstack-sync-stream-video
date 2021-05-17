export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "watch-party",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["video.js/dist/video-js.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: "~plugins/nuxt-video-player-plugin.js", ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  publicRuntimeConfig: {
    API_URL: process.env.API_URL 
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/tailwindcss", "@nuxtjs/fontawesome", "@nuxtjs/dotenv"],

  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/apollo',
],

apollo: {
  clientConfigs: {
    default: {
      httpEndpoint: process.env.API_URL + '/graphql',
    }
  }
},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
