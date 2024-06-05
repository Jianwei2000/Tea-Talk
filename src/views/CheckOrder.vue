<template>
  <div class="container my-8">
    <div class="row my-3 text-center fs-6">
      <div class="col-4 text-primary fw-bold">1.購物清單</div>
      <div class="col-4 text-primary fw-bold">2.填寫資料</div>
      <div class="col-4 text-muted">3.完成訂單</div>
    </div>
    <!-- 進度條 -->
    <div class="progress">
      <div
        class="progress-bar bg-primary"
        role="progressbar"
        :style="{ width: progress + '%' }"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>

    <div class="row mt-5">
      <!-- 左 -->
      <div class="col-md-6">
        <div class="p-5">
          <h2 class="border-bottom border-4 border-warning fs-4 fw-bold pb-3">清單列表</h2>
          <div v-for="item in cartData.carts" :key="item.id">
            <div class="cart-list-body mt-4 d-flex">
              <div class="d-flex flex-grow-1">
                <img class="cart-img rounded-3" :src="item.product.imageUrl" :alt="item.title" />

                <div class="d-flex flex-column justify-content-start ms-3 mt-2">
                  <h1 class="fs-5 fw-bold text-black mb-3">
                    {{ item.product.title }}
                  </h1>

                  <p>數量：{{ item.qty }}</p>
                  <div class="d-sm-none d-flex align-items-end">
                    <p class="fw-bold fs-7 mt-3">
                      NT$
                      {{ $filters.currency(item.product.price * item.qty) }}
                    </p>
                    <del class="fs-8 text-muted ms-2">
                      NT$
                      {{ $filters.currency(item.product.origin_price * item.qty) }}
                    </del>
                  </div>
                </div>
              </div>
              <div class="d-sm-flex flex-sm-column mt-1">
                <div class="d-none d-sm-block">
                  <p class="mb-2 fw-bold fs-5">
                    NT$
                    {{ $filters.currency(item.product.price * item.qty) }}
                  </p>
                  <del class="fs-7 text-muted d-flex flex-column align-items-end">
                    NT$
                    {{ $filters.currency(item.product.origin_price * item.qty) }}
                  </del>
                </div>
              </div>
            </div>
          </div>
          <div v-if="cartData.carts?.length" class="border-top border-4 border-warning mt-4">
            <p class="text-end fw-bold text-primary fs-4 mt-4">
              總金額 NT$ {{ $filters.currency(cartData.final_total) }}
            </p>
          </div>
        </div>
      </div>
      <!-- 右 -->
      <div class="col-md-6">
        <VForm
          class="border rounded-3 shadow p-4 p-md-5"
          ref="form"
          v-slot="{ errors, meta }"
          @submit="createOrder"
        >
          <h2 class="border-bottom border-4 border-warning fs-4 fw-bold pb-3">填寫資料</h2>
          <!--姓名-->
          <div class="form-floating my-3">
            <VField
              v-model="getForm.user.name"
              id="name"
              name="姓名"
              type="text"
              class="form-control border-0 border-bottom fs-5"
              :class="{ 'is-invalid': errors['姓名'] }"
              rules="required"
              placeholder="請輸入姓名"
            />
            <label for="name" class="form-label"><span class="text-danger">* </span>姓名 </label>
            <ErrorMessage name="姓名" class="invalid-feedback" />
          </div>
          <!-- 電話 -->
          <div class="form-floating my-3">
            <VField
              v-model="getForm.user.tel"
              id="tel"
              name="電話"
              type="text"
              class="form-control border-0 border-bottom fs-5"
              :class="{ 'is-invalid': errors['電話'] }"
              rules="required|min:8|max:10"
              placeholder="請輸入電話"
            />
            <label for="tel" class="form-label"><span class="text-danger">* </span>連絡電話</label>
            <ErrorMessage name="電話" class="invalid-feedback" />
          </div>
          <!-- 信箱 -->
          <div class="form-floating my-3">
            <VField
              v-model="getForm.user.email"
              id="email"
              name="Email"
              type="email"
              class="form-control border-0 border-bottom fs-5"
              :class="{ 'is-invalid': errors['Email'] }"
              rules="required|email"
              placeholder="請輸入信箱"
            />
            <label for="email" class="form-label"><span class="text-danger">* </span>Email</label>
            <ErrorMessage name="Email" class="invalid-feedback" />
          </div>
          <!-- 地址 -->
          <div class="form-floating my-3">
            <VField
              v-model="getForm.user.address"
              id="address"
              name="地址"
              type="text"
              :class="{ 'is-invalid': errors['地址'] }"
              class="form-control border-0 border-bottom fs-5"
              rules="required"
              placeholder="請輸入地址"
            />
            <label for="address" class="form-label"
              ><span class="text-danger">* </span>寄送地址</label
            >
            <ErrorMessage name="地址" class="invalid-feedback" />
          </div>
          <!-- 備註 -->
          <div class="mt-4">
            <label for="message" class="form-label fs6 ps-2">備註</label>
            <textarea
              id="message"
              class="form-control form-floating border border-1"
              cols="20"
              rows="5"
              v-model="getForm.message"
            ></textarea>
          </div>

          <div class="d-flex justify-content-around p-0 mt-4">
            <button
              type="button"
              class="btn text-muted w-50 fs-5 border border-2 me-3"
              @click="goBack()"
            >
              返回
            </button>
            <button
              type="submit"
              class="btn btn-primary shadow text-white w-50 fw-bold fs-5"
              :disabled="!meta.valid"
            >
              下一步
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import emitter from '@/methods/emitter'

// 创建一个 ref 变量来存储进度值
const progress = ref(15)

// 定义一个函数来更新进度值
function updateProgress(value) {
  progress.value = value
}

const cartData = ref({
  carts: []
})
const router = useRouter()

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

// 初始化 form 物件及其屬性
const getForm = {
  user: {
    name: ref(''),
    tel: ref(''),
    email: ref(''),
    address: ref('')
  },
  message: ''
}
function createOrder() {
  axios
    .post(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/order`, {
      data: getForm
    })
    .then((res) => {
      const { orderId } = res.data
      router.push(`/checkout/${orderId}`)
    })
    .catch((err) => {
      console.error('Error:', err.response)
    })
}
//回上一頁
function goBack() {
  router.go(-1)
}

onMounted(() => {
  let value = 15 //從15開始
  const interval = setInterval(() => {
    if (value >= 50) {
      clearInterval(interval) // 清除定时器
    } else {
      value += 5 // 调整增量以改变进度条速度
      updateProgress(value) // 更新进度值
    }
  }, 50) // 调整时间间隔以改变进度条速度

  getCart()
  // 監聽加入購物車事件
  emitter.on('get-cart', getCart)
})

onUnmounted(() => {
  emitter.off('get-cart', getCart)
})
</script>
