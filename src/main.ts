import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { abilitiesPlugin, Can } from '@casl/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/material'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
const authStore = useAuthStore()
authStore.initializePermissions()

app
  .use(abilitiesPlugin, authStore.ability!, { useGlobalProperties: true })
  .component(Can.name!, Can)

app.use(router)
app.use(VueQueryPlugin)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})
app.mount('#app')
