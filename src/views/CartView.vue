<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="container my-8">
    <div class="row my-3 text-center fs-6">
      <div class="col-4 text-primary fw-bold">1.購物清單</div>
      <div class="col-4 text-muted">2.填寫資料</div>
      <div class="col-4 text-muted">3.完成訂單</div>
    </div>
    <!-- 進度條 -->
    <div class="progress">
      <div
        class="progress-bar bg-primary"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <div v-if="cartData.carts?.length === 0" class="text-center my-7">
      <h2 class="text-muted my-4">尚無購物清單紀錄</h2>
      <p class="h4 text-muted my-4">趕快前往商品頁面，將喜歡的商品加到購物車吧！</p>
      <div class="btn btn-primary btn-lg my-4" @click="router.push(`/products`)">前往選購</div>
    </div>
    <div class="row mt-5" v-else>
      <!-- 左邊 -->
      <div class="col-md-8">
        <div class="border">
          <table class="table align-middle text-center table-striped table-hover mb-4">
            <thead>
              <tr class="table-warning">
                <th style=""></th>
                <th class="d-none d-md-table-cell">圖片</th>
                <th class="d-none d-sm-table-cell">商品名稱</th>
                <th class="d-md-none">品名</th>
                <th class="d-sm-table-cell">單價</th>
                <th style="min-width: 55px; width: 120px">數量</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartData.carts" :key="item.id">
                <!-- 刪除鈕 -->
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-danger border-0 p-1"
                    @click="delProduct(item.id)"
                  >
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </td>
                <!-- 圖片 -->
                <td class="d-none d-md-block">
                  <RouterLink :to="`/product/${item.product.id}`">
                    <img
                      :src="item.product.imageUrl"
                      class="img-cart rounded-3"
                      :alt="item.title"
                    />
                  </RouterLink>
                </td>
                <!-- 品名 -->
                <td>
                  {{ item.product.title }}
                </td>
                <!-- 單價 -->
                <td>NT$ {{ $filters.currency(item.product.price) }}</td>
                <!-- 數量 -->
                <td>
                  <div class="input-group input-group-sm">
                    <input
                      min="1"
                      type="number"
                      class="form-control text-center"
                      v-model.number="item.qty"
                      @change="updateCart(item)"
                    />
                  </div>
                </td>
                <!-- 小計 -->
                <td>NT$ {{ $filters.currency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-end">
            <button class="mb-4 btn btn-dark rounded-0 me-4" @click="delAllProduct()">
              清除購物清單
            </button>
          </div>
        </div>
      </div>
      <!-- 右邊 -->
      <div class="col-md-4 mt-4 mt-md-0">
        <div class="border shadow p-3">
          <ul class="p-4">
            <li class="text-muted fs-6 d-flex justify-content-between">
              小計
              <span> NT$ {{ $filters.currency(cartData.total) }}</span>
            </li>
            <li class="text-muted fs-6 d-flex justify-content-between mt-2">
              優惠碼
              <span>-NT$ {{ $filters.currency(cartData.total - cartData.final_total) }}</span>
            </li>
            <li
              class="fw-bold text-primary fs-4 d-flex justify-content-between border-top border-2 pt-3 mt-3"
            >
              總計
              <span class="fs-4">NT$ {{ $filters.currency(cartData.final_total) }}</span>
            </li>
          </ul>

          <div class="input-group my-3">
            <input
              type="text"
              class="form-control fs-7 rounded-0 border border-2 border-muted"
              v-model="couponCode"
              placeholder="輸入優惠碼"
            />

            <button class="btn btn-primary fs-6 rounded-0" type="button" @click="applyCoupon">
              套用
            </button>
          </div>

          <button
            type="button"
            to="/checkOrder"
            class="btn btn-outline-danger w-100 fs-5 my-4"
            @click="goToCheckOrder()"
          >
            前往結帳
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import emitter from '@/methods/emitter'
import Swal from 'sweetalert2'

const isLoading = ref(false)

// 创建一个 ref 变量来存储进度值
const progress = ref(0)

// 定义一个函数来更新进度值
function updateProgress(value) {
  progress.value = value
}

const router = useRouter()

const products = ref([])

const cartData = ref({
  carts: []
})

//獲取購物車
function getCart() {
  isLoading.value = true
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart`)
    .then((res) => {
      cartData.value = res.data.data
      isLoading.value = false
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
//全刪
function delAllProduct() {
  Swal.fire({
    title: '是否要清除?',
    icon: 'warning',
    confirmButtonText: '確定',
    confirmButtonColor: '#464C3A',
    showCancelButton: true,
    cancelButtonText: '取消',
    cancelButtonColor: '#F75000',
    reverseButtons: true
  }).then((res) => {
    if (res.isConfirmed) {
      axios
        .delete(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/carts`)
        .then(() => {
          getCart()
          emitter.emit('get-cart')
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
  })
}
// 更新購物車
const loadingItem = ref('')
function updateCart(item) {
  // 设置当前加载的购物车项目的ID
  loadingItem.value = item.id
  console.log('Updating cart item:', item) // 调试输出
  const url = `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/cart/${item.id}`
  const data = {
    product_id: item.product_id,
    qty: item.qty
  }
  axios
    .put(url, { data })

    .then(() => {
      getCart()
      loadingItem.value = ''
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: err.response.data.message
      })
      console.error('錯誤訊息:', err.response)
      loadingItem.value = ''
    })
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

//轉址到checkorder
function goToCheckOrder() {
  router.push('/checkorder')
}

//套用按鈕
const couponCode = ref('')
function applyCoupon() {
  axios
    .post(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/coupon`, {
      data: { code: couponCode.value }
    })
    .then((res) => {
      cartData.value.carts.final_total = res.data.final_total
      Swal.fire({
        icon: 'success',
        title: '已套用優惠',
        showConfirmButton: false,
        timer: 1500
      })
      getCart()
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '請輸入正確的優惠碼',
        text: err.response.data.message,
        showConfirmButton: false,
        timer: 2000
      })
      console.error(err.response)
    })
}

onMounted(() => {
  let value = 0 //從0開始
  const interval = setInterval(() => {
    if (value >= 15) {
      clearInterval(interval) // 清除定时器
    } else {
      value += 5 // 调整增量以改变进度条速度
      updateProgress(value) // 更新进度值
    }
  }, 50) // 调整时间间隔以改变进度条速度

  getProductsList()

  getCart()
  // 監聽加入購物車事件
  emitter.on('get-cart', getCart)
})

onUnmounted(() => {
  emitter.off('get-cart', getCart)
})
</script>

<style>
.img-cart {
  cursor: pointer;
  height: 8rem;
  width: 8rem;
  object-fit: cover;
}
</style>
