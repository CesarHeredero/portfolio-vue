import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createStore } from 'vuex'
import App from './App.vue'
import es from './locales/es'
import en from './locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
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
