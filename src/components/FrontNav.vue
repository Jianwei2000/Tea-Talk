<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="fixed-top navbar-expand-lg text-primary bg-white shadow">
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <!-- logo -->
        <h1 class="mt-2 mt-md-1">
          <RouterLink to="/" class="ms-5 navbar-brand dancing-script fs-1 fw-bold"
            >Tea Talk</RouterLink
          >
        </h1>
        <!-- 選單 -->
        <div class="d-md-block d-none">
          <ul class="d-flex mt-3 list-unstyled">
            <li>
              <RouterLink class="link pb-3 ms-5 fs-7 fw-bold" to="/products">所有商品</RouterLink>
            </li>
            <li>
              <RouterLink class="link pb-3 ms-4 fs-7 fw-bold" to="/about">關於我們</RouterLink>
            </li>

            <li>
              <RouterLink class="link pb-3 ms-4 fs-7 fw-bold" to="/qa">常見問題</RouterLink>
            </li>
            <li>
              <RouterLink class="link pb-3 ms-4 fs-7 fw-bold" to="/odsearch">訂單查詢</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <!-- 收藏+購物車 -->
      <div class="d-flex me-5">
        <ul class="d-flex list-unstyled mt-2">
          <li>
            <RouterLink class="home text-primary" to="/favorite">
              <span class="material-icons text-primary position-relative fs-3 me-4">
                <i class="bi bi-heart-fill"></i>
                <span
                  class="favorite-num rounded-pill bg-danger position-absolute"
                  v-show="favoriteStore.favoriteCount > 0"
                >
                  {{ favoriteStore.favoriteCount }}
                </span>
              </span>
            </RouterLink>
          </li>
          <li>
            <a
              class="fs-3 text-primary position-relative"
              data-bs-toggle="offcanvas"
              href="#offcanvasExample"
              role="button"
              aria-controls="offcanvasExample"
            >
              <i class="bi bi-cart-fill"></i>
              <span
                class="cart-num rounded-pill bg-danger position-absolute"
                v-show="cartData.carts.length > 0"
                >{{ cartData.carts.length }}</span
              >
            </a>
          </li>
          <li>
            <!-- 漢堡選單 -->
            <div class="ms-4 dropdown d-md-none">
              <a
                class="fs-2 dropdown-toggle"
                href="#"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-list"></i>
              </a>

              <ul class="dropdown-menu shadow text-center" aria-labelledby="dropdownMenuLink">
                <li>
                  <RouterLink class="link fs-5 fw-bold" to="/products">所有商品</RouterLink>
                </li>
                <hr />
                <li>
                  <RouterLink class="link fs-5 fw-bold" to="/about">關於我們</RouterLink>
                </li>
                <hr />

                <li>
                  <RouterLink class="link fs-5 fw-bold" to="/qa">常見問題</RouterLink>
                </li>
                <hr />
                <li>
                  <RouterLink class="link fs-5 fw-bold" to="/odsearch">訂單查詢</RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- offcanvas購物車 -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">購物車</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body p-4" v-if="cartData.carts?.length !== 0">
      <!-- 商品 -->
      <div v-for="item in cartData.carts" :key="item.id">
        <div class="card-item d-flex mb-3" :to="`/product/${item.product.id}`">
          <span
            class="material-icons-outlined align-self-center text-muted del-icon"
            @click="delProduct(item.id)"
          >
            <i class="bi bi-trash3-fill"></i>
          </span>
          <div class="mx-3">
            <img class="cart-img rounded-3" :src="item.product.imageUrl" :alt="item.title" />
          </div>
          <div class="d-flex flex-column justify-content-start pt-2 pb-1">
            <h3 class="fw-bold fs-5 mb-3">
              {{ item.product.title }}
            </h3>
            <div class="d-flex align-items-end mb-3">
              <p class="fw-bold fs-5">
                NT$
                {{ $filters.currency(item.product.price * item.qty) }}
              </p>
              <del class="fw-bold fs-7 ms-2 text-muted">
                NT$
                {{ $filters.currency(item.product.origin_price * item.qty) }}
              </del>
            </div>
            <p class="fs-7">數量：{{ item.qty }}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary text-white mt-4 w-100"
        data-bs-dismiss="offcanvas"
        @click="goToCart"
      >
        前往購物清單
      </button>
    </div>
    <template v-else>
      <div class="p-4 text-center">
        <span class="fs-1 material-icons-outlined sentiment_dissatisfied text-primary pb-3">
          <i class="bi bi-emoji-smile-fill"></i>
        </span>
        <p>沒有任何商品</p>
        <button
          type="button"
          class="btn btn-primary text-white mt-4 w-100"
          data-bs-dismiss="offcanvas"
          @click="goToProducts"
        >
          來去選購！
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import emitter from '@/methods/emitter'
import Swal from 'sweetalert2'
import { useFavoriteStore } from '@/stores/favoriteStore'

const favoriteStore = useFavoriteStore()

const router = useRouter()

const products = ref([])

const cartData = ref({
  carts: []
})

//獲取購物車
function getCart() {
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart`)
    .then((res) => {
      cartData.value = res.data.data
    })
    .catch((err) => {
      console.error(err.response)
    })
}
//刪除購物車項目
function delProduct(id) {
  axios
    .delete(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart/${id}`)
    .then(() => {
      getCart()
      emitter.emit('get-cart')
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '已刪除',
        showConfirmButton: false,
        timer: 1000
      })
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: err.response.data.message
      })
      console.error('錯誤訊息:', err.response)
    })
}
//連結到購物車
function goToCart() {
  router.push('/cart')
}
//連結到商品列表
function goToProducts() {
  router.push('/products')
}

function getProductsList() {
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/products/all`)
    .then((res) => {
      products.value = res.data.products
    })
    .catch((err) => {
      console.error(err.response)
    })
}

onMounted(() => {
  getProductsList()
  // 監聽加入購物車事件
  emitter.on('get-cart', getCart)
})

onUnmounted(() => {
  emitter.off('get-cart', getCart)
})
</script>

<style>
.link {
  text-decoration: none;
}

.material-icons {
  font-size: 1.8rem;
  cursor: pointer;
}
.favorite-num {
  font-size: 0.75rem;
  color: white;
  padding: 0.1rem 0.5rem 0.3rem;
  top: 0;
  left: 15px;
}
.cart-num {
  font-size: 0.75rem;
  color: white;
  padding: 0.1rem 0.5rem 0.3rem;
  top: 0;
  left: 15px;
}

.cart-img {
  height: 7.5rem;
  width: 7.5rem;
  object-fit: cover;
}
.del-icon {
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
