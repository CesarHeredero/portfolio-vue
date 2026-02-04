import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createStore } from 'vuex'
import App from './App.vue'
import es from './locales/es'
import en from './locales/en'

const CONTENT_API_BASE = process.env.VUE_APP_CONTENT_API_BASE

const fetchJsonNoCache = async (url) => {
  const target = new URL(url)
  target.searchParams.set('_t', Date.now().toString())
  const response = await fetch(target.toString(), { cache: 'no-store' })
  return response
}

const loadRemoteMessages = async () => {
  if (!CONTENT_API_BASE) {
    return { es, en }
  }

  try {
    const [esResponse, enResponse] = await Promise.all([
      fetchJsonNoCache(`${CONTENT_API_BASE}/content/es`),
      fetchJsonNoCache(`${CONTENT_API_BASE}/content/en`)
    ])

    if (!esResponse.ok || !enResponse.ok) {
      return { es, en }
    }

    const esPayload = await esResponse.json()
    const enPayload = await enResponse.json()

    return {
      es: esPayload.data || es,
      en: enPayload.data || en
    }
  } catch (error) {
    return { es, en }
  }
}

const bootstrap = async () => {
  const messages = await loadRemoteMessages()

  const i18n = createI18n({
    legacy: false,
    locale: 'es',
    fallbackLocale: 'es',
    messages
  })

  const store = createStore({
    state() {
      return {
        locale: 'es'
      }
    },
    mutations: {
      setLocale(state, locale) {
        state.locale = locale
        i18n.global.locale.value = locale
      }
    },
    actions: {
      setLocale({ commit }, locale) {
        commit('setLocale', locale)
      }
    }
  })

  const app = createApp(App)
  app.use(i18n)
  app.use(store)
  app.mount('#app')
}

bootstrap()
