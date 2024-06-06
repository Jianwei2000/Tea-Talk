<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="container my-7">
    <div class="row">
      <!-- 左邊 -->
      <div class="product-img col-md-7">
        <div class="border">
          <div
            class="product-img-imageUrl"
            :style="{ backgroundImage: `url(${product.imageUrl})` }"
          ></div>
        </div>
      </div>
      <!-- 右邊 -->
      <div class="col-md-5">
        <div class="mt-3 mt-md-0">
          <!--麵包屑-->
          <nav aria-label="breadcrumb ">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <RouterLink to="/" class="fw-bold text-decoration-none"
                  ><i class="bi bi-house-door-fill"></i> 首頁</RouterLink
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <RouterLink to="/products" class="text-decoration-none">所有商品</RouterLink>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ product.category }}
              </li>
            </ol>
          </nav>
          <!-- 商品名 -->
          <div class="d-flex justify-content-between">
            <h1 class="fw-bold mb-4 fs-2">
              {{ product.title }}
            </h1>
            <!-- 加入收藏 -->
            <div class="fs-3 pfav-icon position-relative" @click="toggleFavorite(product)">
              <span
                class="material-icons-outlined pfav position-absolute text-danger"
                v-if="isFavorite(product.id)"
              >
                <i class="bi bi-heart-fill"></i>
              </span>
              <span class="material-icons-outlined pfav position-absolute text-danger" v-else>
                <i class="bi bi-heart"></i>
              </span>
            </div>
          </div>

          <!-- 商品描述 -->
          <h2 class="product-description lh-lg mt-4 p-3 rounded-3 fs-6 shadow">
            {{ product.description }}
          </h2>
          <!-- 輸入數量 -->
          <input type="number" class="form-control mt-5" min="1" max="10" v-model.number="qty" />
          <div class="input-group m-0 row">
            <button
              class="btn border border-dark col-6 rounded-0"
              @click="addCart(product.id, qty)"
            >
              加入購物車
            </button>
            <button @click="buyNow(product.id, qty)" class="btn btn-dark col-6 rounded-0">
              立即購買
            </button>
          </div>
          <!-- 價格 -->
          <div
            class="price fw-bold text-primary mt-4 text-end"
            v-if="product.origin_price === product.price"
          >
            NT$ {{ $filters.currency(product.price) }} 元
          </div>
          <div v-else class="origin-price d-flex flex-column align-items-end mt-4">
            <div class="pe-2 text-primary fw-bold">
              NT$ {{ $filters.currency(product.price) }} 元
            </div>
            <del class="text-decoration-line-through ps-2">
              NT$ {{ $filters.currency(product.origin_price) }} 元</del
            >
          </div>
          <!-- 商品說明 -->
          <div class="accordion rounded-3 shadow mt-4" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <div
                class="accordion-button text-standard"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                商品詳細說明
              </div>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div class="accordion-body lh-lg border-top border-1 border-primary">
                  {{ product.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 精選推薦 輪播 -->
    <div class="container my-6 products-selected">
      <h2 class="fs-2 text-primary fw-bold mb-5">
        精選推薦 <span class="fs-5 dancing-script">Selected</span>
      </h2>
      <RandomSwiper />
    </div>
  </div>
</template>

<script setup>
import RandomSwiper from '@/components/RandomSwiper.vue'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import emitter from '@/methods/emitter'
import Swal from 'sweetalert2'
import { useFavoriteStore } from '@/stores/favoriteStore'

const isLoading = ref(false)

//加入收藏
const favoriteStore = useFavoriteStore()
const { toggleFavorite, isFavorite } = favoriteStore

const product = ref({
  imageUrl: '',
  title: '',
  origin_price: 0,
  price: 0,
  description: '',
  content: ''
})

const route = useRoute()
const router = useRouter()

function getProduct(id = route.params.id) {
  isLoading.value = true
  document.documentElement.scrollTop = 0
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/product/${id}`)
    .then((res) => {
      // 儲存產品資料與分頁資訊
      product.value = res.data.product
      console.log(res.data)
      isLoading.value = false
    })
    .catch((error) => {
      console.error('錯誤訊息:', error.response)
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

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getProduct(newId)
    }
  }
)

onMounted(() => {
  getProduct()
})
</script>

<style>
.product-img-imageUrl {
  height: 45rem;
  background-position: center;
  background-size: cover;
}
.origin-price {
  font-size: 1.4rem;
}
.product-description {
  background-color: #e6ccab57;
}

.pfav-icon {
  height: 3.5rem;
  width: 3.5rem;

  border-radius: 50%;
  cursor: pointer;
}
.pfav {
  top: 10%;
  left: 25%;
}
@media (max-width: 768px) {
  .product-img-imageUrl {
    height: 20rem;
    background-position: center;
    background-size: cover;
  }
}
</style>
