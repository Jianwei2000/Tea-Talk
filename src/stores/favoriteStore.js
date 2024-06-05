import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
  //儲存收藏的項目
  state: () => ({
    favorites: []
  }),
  //計算收藏的數量
  getters: {
    favoriteCount: (state) => state.favorites.length,
    isFavorite: (state) => (productId) => state.favorites.some((item) => item.id === productId)
  },
  //收藏功能
  actions: {
    toggleFavorite(product) {
      const index = this.favorites.findIndex((item) => item.id === product.id)
      if (index === -1) {
        this.favorites.push(product)
      } else {
        this.favorites.splice(index, 1)
      }
    }
  }
})
