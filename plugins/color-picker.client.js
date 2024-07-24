import { defineNuxtPlugin } from '#app'
import { Chrome } from 'vue-color'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('chrome-picker', Chrome)
})
