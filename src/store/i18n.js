import es from '@/locales/es'
import en from '@/locales/en'

export default {
  state: {
    locale: 'es',
    messages: {
      es,
      en
    }
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale
    }
  },
  actions: {
    setLocale({ commit }, locale) {
      commit('setLocale', locale)
    }
  },
  getters: {
    currentLocale: state => state.locale,
    currentMessages: state => state.messages[state.locale]
  }
} 