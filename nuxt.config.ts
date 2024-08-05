

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,

  


  experimental: {
    payloadExtraction: false
  },


  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    { src: '~/plugins/color-picker.client.js', mode: 'client' }
  ],


  
  

  modules: [
    "nuxt-icon",
    "nuxt-lodash",


    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@vite-pwa/nuxt",
  ],

  pwa: {
  
    

    manifest: {
    
      name: "Linktree Clone",
      short_name: "Linktree Clone",
      description: "This is a Linktree Clone",
      theme_color: "#32CD32",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
    workbox: {
      // Successfully precaches other assets:
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      // Try to Runtime Cache the home page:
      runtimeCaching: [{
        urlPattern: "/",
        handler: 'NetworkFirst',
      }],
      // Don't use navigationFallback because "/" isn't in our precache manfiest:
       navigateFallback: undefined
    },
  

  },


  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },



  compatibilityDate: "2024-07-14",
  // serverHandlers: [
  //   { route: '/*', handler: '~/server/middleware/cors.js' },
  // ],
});

