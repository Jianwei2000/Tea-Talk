<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="container my-7">
    <div class="d-sm-flex justify-content-sm-between">
      <!--麵包屑-->
      <nav aria-label="breadcrumb ">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/" class="fw-bold text-decoration-none"
              ><i class="bi bi-house-door-fill"></i> 首頁</RouterLink
            >
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <RouterLink to="/products" class="text-decoration-none" @click="getProductsList"
              >所有商品</RouterLink
            >
          </li>
        </ol>
      </nav>
      <!-- 搜尋欄 -->
      <div>
        <div class="d-flex">
          <input
            type="search"
            v-model.trim="search"
            placeholder="請輸入關鍵字"
            class="form-control fs-7 px-2 rounded-0 border border-1 border-muted w-100"
          />
          <button
            type="submit"
            class="btn bg-primary d-flex align-items-center rounded-0"
            @click="searchProducts"
          >
            <span class="material-icons-outlined text-white"> <i class="bi bi-search"></i> </span>
          </button>
        </div>
        <ul
          class="search-list shadow mt-2 position-absolute list-unstyled"
          :class="searchComplete ? '' : 'd-none'"
        >
          <RouterLink
            v-for="item in matchProducts"
            :key="item.title"
            class="text-decoration-none"
            :to="`/product/${item.id}`"
          >
            <li class="search-result p-3 fs-7">
              {{ item.title }}
            </li>
          </RouterLink>
        </ul>
      </div>
    </div>

    <!-- 商品 -->
    <div class="menu row mt-5">
      <!-- 分類選單 -->
      <div class="category ps-md-5 col-md-6 col-lg-3">
        <h2
          class="mb-4 fs-4 fw-bold text-primary d-flex align-items-center justify-content-center justify-content-md-start"
          @click="getCategory('')"
        >
          商品分類
        </h2>
        <ul class="list-active d-flex d-md-block justify-content-evenly list-unstyled mt-3">
          <li
            class="mb-4"
            v-for="item in categories"
            :key="`類別_${item}`"
            @click="getCategory(item)"
          >
            <a
              ><h2 class="fs-5">{{ item }}</h2></a
            >
          </li>
        </ul>
      </div>
      <!-- 商品展示 -->
      <div class="col-md-6 col-lg-9">
        <!-- 搜尋不到商品 -->
        <template v-if="products.length === 0">
          <div class="text-center pt-4">
            <span class="material-icons-outlined sentiment_dissatisfied fs-1 text-primary pb-3">
              <i class="bi bi-emoji-dizzy"></i>
            </span>
            <p class="text-muted mb-4 fs-5 fw-bold">沒有符合條件的搜尋結果！</p>
          </div>
        </template>
        <!-- 搜尋到商品 -->
        <template v-else>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
            <div class="col" v-for="item in products" :key="item.id">
              <div class="card border-width h-100 shadow position-relative">
                <!-- 加入收藏 -->
                <div
                  class="fs-3 fav-icon position-absolute position-relative"
                  @click="toggleFavorite(item)"
                >
                  <span
                    class="material-icons-outlined favorite position-absolute text-white"
                    v-if="isFavorite(item.id)"
                  >
                    <i class="bi bi-heart-fill"></i>
                  </span>
                  <span
                    class="material-icons-outlined favorite position-absolute text-white"
                    v-else
                  >
                    <i class="bi bi-heart"></i>
                  </span>
                </div>
                <!-- 商品圖 -->
                <RouterLink :to="`/product/${item.id}`">
                  <div class="card-img" :style="{ backgroundImage: `url(${item.imageUrl})` }"></div
                ></RouterLink>
                <div class="card-body d-flex align-items-end justify-content-between">
                  <div class="card-body-content">
                    <RouterLink
                      class="card-title fs-5 text-black text-decoration-none fw-bold lh-base mb-2"
                      :to="`/product/${item.id}`"
                    >
                      {{ item.title }}
                    </RouterLink>
                    <div
                      class="price fs-5 fw-bold text-primary mt-3"
                      v-if="item.origin_price === item.price"
                    >
                      NT$ {{ $filters.currency(item.price) }} 元
                    </div>
                    <div class="origin-price d-flex mt-3" v-else>
                      <p class="fs-5 pe-2 text-primary fs-5 fw-bold">
                        NT$ {{ $filters.currency(item.price) }} 元
                      </p>
                      <del class="fs-6 text-muted">
                        NT$
                        {{ $filters.currency(item.origin_price) }} 元</del
                      >
                    </div>
                  </div>

                  <!-- 加入購物車 -->
                  <div @click="addCart(item.id)">
                    <a class="cart-icon text-primary fs-2 me-2">
                      <span class="material-icons-outlined">
                        <i class="bi bi-cart-plus-fill"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <PaginationCom
        class="d-flex justify-content-md-end justify-content-center mt-5"
        :pages="pagination"
        @get-page="getProductsList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import PaginationCom from '@/components/PaginationCom.vue'
import Swal from 'sweetalert2'
import emitter from '@/methods/emitter'
import { useFavoriteStore } from '@/stores/favoriteStore'

const isLoading = ref('false')

const products = ref([])
const pagination = ref({})

const allProducts = ref([])

//獲取客戶端商品數據
function getProductsList(page = 1) {
  document.documentElement.scrollTop = 0
  isLoading.value = true
  axios
    .get(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/products/?page=${page}&category=${category.value}`
    )
    .then((res) => {
      // 儲存產品資料與分頁資訊
      products.value = res.data.products
      pagination.value = res.data.pagination
      isLoading.value = false
      console.log(res.data)
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: error.response.data.message
      })
      console.error('錯誤訊息:', error.response)
    })
}
function getAllProducts() {
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/products/all`)
    .then((res) => {
      allProducts.value = res.data.products
      getCategories()
      console.log(res.data)
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: error.response.data.message
      })
      console.error('錯誤訊息:', error.response)
    })
}
//加入收藏
const favoriteStore = useFavoriteStore()
const { toggleFavorite, isFavorite } = favoriteStore

//加入購物車
const loadingItem = ref('')

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

//獲取分類方法
const category = ref('')
const categories = ref([])

function getCategories() {
  //取出 allProducts 所有產品的 category
  const MapCategories = allProducts.value.map((item) => item.category)
  //使用 set 過濾重複的元素，並轉成陣列
  categories.value = [...new Set(MapCategories)]
}

// 设置选中分类
function getCategory(selectedCategory) {
  category.value = selectedCategory
}

//搜尋商品方法
const search = ref('')
const searchComplete = ref(false)

function searchProducts() {
  products.value = matchProducts.value
  searchComplete.value = false
  search.value = ''
}

// 监听 category 的变化
watch(category, () => {
  getProductsList()
})

// 监听 search 的变化
watch(search, (newVal) => {
  if (newVal) {
    searchComplete.value = true
    pagination.value.current_page = 1
    pagination.value.total_pages = 1
    pagination.value.has_next = false
  } else {
    searchComplete.value = false
  }
})

// 定义 matchProducts 计算属性
const matchProducts = computed(() => {
  const strArr = search.value.split(' ') // 以空白格切分字串
  const arr = []
  // 比对字串
  strArr.forEach((str) => {
    allProducts.value.forEach((item) => {
      if (item.title.includes(str)) {
        arr.push(item)
      }
    })
  })
  // 如果输入两个关键字就会出现重复的资料，所以需要删除重复资料
  // 过滤出重复的元素
  return [...new Set(arr)]
})

onMounted(() => {
  getProductsList()
  getAllProducts()
})
</script>

<style lang="scss">
.search-list {
  width: 230px;
  background-color: #fff;
  z-index: 1;
  .search-result {
    letter-spacing: 1px;
    &:hover {
      background-color: #e6ccab;
      cursor: pointer;
    }
    a {
      color: black;
    }
  }
}

.list-active {
  cursor: pointer;
}

.card {
  border-radius: 1rem;
  transition-duration: 0.3s;
  &:hover {
    transform: translateY(-8px);
  }
}

.card-img {
  height: 20rem;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
}
.cart-icon {
  cursor: pointer;
}
.fav-icon {
  top: 3%;
  right: 3%;
  height: 3.5rem;
  width: 3.5rem;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  cursor: pointer;
  display: none;
  .favorite {
    top: 15%;
    left: 25%;
  }
}

.card {
  &:hover {
    .fav-icon {
      display: block;
      animation: fav-animation;
      animation-duration: 0.5s;
      transition: all 0.3s ease;
    }
  }
}

.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.img-hover {
  transition: all 0.3s ease-out;
  &:hover {
    filter: brightness(70%);
    transform: scale(1.2, 1.2);
  }
}

@media (max-width: 768px) {
  .fav-icon {
    top: 3%;
    right: 3%;
    height: 3.5rem;
    width: 3.5rem;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    cursor: pointer;
    display: block;
    .favorite {
      top: 18%;
      left: 30%;
    }
  }
}
@keyframes fav-animation {
  from {
    top: -1%;
  }
  to {
    top: 3%;
  }
}
</style>
