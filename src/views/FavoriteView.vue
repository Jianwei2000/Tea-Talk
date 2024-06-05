<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="banner-fav position-relative mt-5">
    <div class="container position-absolute top-50 start-50 translate-middle text-center">
      <h1 class="text-white">收藏項目</h1>
      <h2 class="h4 text-white">還在猶豫你念念不忘的商品嗎？趕快加入購物車吧！</h2>
    </div>
  </div>
  <div class="container my-5">
    <div class="text-center" v-if="favoriteStore.favoriteCount < 1">
      <h2 class="text-muted mt-7">尚無收藏紀錄</h2>
      <p class="h4 text-muted my-4">趕快前往商品頁面，將喜歡的商品加入收藏吧！</p>
      <div class="btn btn-primary btn-lg my-4" @click="router.push(`/products`)">前往選購</div>
    </div>
    <div class="row justify-content-center">
      <ul class="list-unstyled mx-auto col-md-8">
        <li v-for="favorite in favorites" :key="favorite.id">
          <div class="card shadow mb-5">
            <div class="row g-0">
              <div class="col-md-4">
                <RouterLink :to="`/product/${favorite.id}`">
                  <img :src="favorite.imageUrl" class="fav-img rounded-start" alt="..." />
                </RouterLink>
              </div>
              <div class="col-md-8 py-5 position-relative">
                <!-- 加入收藏 -->
                <div
                  class="fs-3 favorite-icon position-absolute position-relative"
                  @click="toggleFavorite(favorite)"
                >
                  <span
                    class="material-icons-outlined fav position-absolute text-danger"
                    v-if="isFavorite(favorite.id)"
                  >
                    <i class="bi bi-heart-fill"></i>
                  </span>
                  <span class="material-icons-outlined fav position-absolute text-white" v-else>
                    <i class="bi bi-heart"></i>
                  </span>
                </div>
                <div class="card-body">
                  <h5 class="card-title fw-bold fs-4">{{ favorite.title }}</h5>
                  <p class="card-text">
                    {{ favorite.description }}
                  </p>
                </div>
                <div class="input-group justify-content-center mt-4">
                  <button
                    class="btn border border-dark col-md-4 rounded-0"
                    @click="addCart(favorite.id, qty)"
                  >
                    加入購物車
                  </button>
                  <button @click="buyNow(favorite.id, qty)" class="btn btn-dark col-md-4 rounded-0">
                    立即購買
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 精選推薦 輪播 -->
    <div class="container mt-5 products-selected">
      <h2 class="fs-2 text-primary fw-bold mb-5">
        精選推薦 <span class="fs-5 dancing-script">Selected</span>
      </h2>
      <RandomSwiper />
    </div>
  </div>
</template>

<script setup>
import RandomSwiper from '@/components/RandomSwiper.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import Swal from 'sweetalert2'
import emitter from '@/methods/emitter'
import { useRouter } from 'vue-router'

const isLoading = ref(false)

const router = useRouter()

const favoriteStore = useFavoriteStore()
const { favorites } = favoriteStore
const { toggleFavorite, isFavorite } = favoriteStore

const allProducts = ref([])

function getAllProducts() {
  isLoading.value = true
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/products/all`)
    .then((res) => {
      allProducts.value = res.data.products
      console.log(res.data)
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err.response)
      isLoading.value = false
    })
}

//加入購物車

const loadingItem = ref('')
// 初始化 qty 的值為 1
const qty = ref(1)

function addCart(id, qty = 1) {
  isLoading.value = true
  loadingItem.value = id
  axios
    .post(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart`, {
      data: { product_id: id, qty }
    })
    .then(() => {
      //讀取完後清空
      loadingItem.value = ''
      emitter.emit('get-cart')
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '已加入購物車',
        showConfirmButton: false,
        timer: 1000
      })
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err.response)
    })
}

//立即購買
function buyNow(id, qty = 1) {
  loadingItem.value = id
  axios
    .post(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart`, {
      data: { product_id: id, qty }
    })
    .then(() => {
      //讀取完後清空
      loadingItem.value = ''
      emitter.emit('get-cart')
      router.push('/cart')
    })
    .catch((err) => {
      console.error(err.response)
    })
}

onMounted(() => {
  getAllProducts()
})
</script>

<style>
.banner-fav {
  height: 280px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.unsplash.com/photo-1559538733-914540eace75?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
}
.fav-img {
  height: 18rem;
  width: 100%;
  object-fit: cover;
}
.favorite-icon {
  top: 3%;
  right: 4%;
  height: 3.5rem;
  width: 3.5rem;

  border-radius: 50%;
  cursor: pointer;
}
.fav {
  top: 10%;
  left: 25%;
}
</style>
