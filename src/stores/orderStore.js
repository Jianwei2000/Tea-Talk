// stores/orderStore.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    selectedRadio: ''
  }),
  actions: {
    setSelectedRadio(value) {
      this.selectedRadio = value
    }
  }
})
