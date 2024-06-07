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

    <div class="d-flex justify-content-center my-5">
      <div class="col col-md-7 bg-light p-3 p-md-5 rounded-3 shadow">
        <h2 class="text-center border-bottom border-4 border-warning fs-3 fw-bold pb-3">
          訂購資訊
        </h2>
        <table class="table mt-4 fs-lg-5">
          <tbody>
            <tr>
              <th>訂單編號</th>
              <td>{{ order.id }}</td>
            </tr>
            <tr>
              <th>訂購人</th>
              <td>{{ order.user?.name }}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{{ order.user?.email }}</td>
            </tr>

            <tr>
              <th>聯絡電話</th>
              <td>{{ order.user?.tel }}</td>
            </tr>
            <tr>
              <th>寄送地址</th>
              <td>{{ order.user?.address }}</td>
            </tr>
            <tr v-if="order.message">
              <th>備註</th>
              <td>{{ order.message }}</td>
            </tr>
            <tr>
              <th>總金額</th>
              <td>NTD$ {{ $filters.currency(order.total) }} 元</td>
            </tr>
          </tbody>
        </table>

        <div class="my-3">
          <div class="border p-3">
            <h5 class="my-3">付款方式</h5>
            <div class="my-3">
              <!-- 貨付 -->
              <div class="form-check">
                <VField
                  id="getpay"
                  name="paymentMethod"
                  type="radio"
                  class="form-check-input"
                  rules="required"
                  value="貨到付款"
                  v-model="paymethod"
                />
                <label class="form-check-label" for="getpay"> 貨到付款 </label>
              </div>
              <!-- 轉帳 -->

              <div class="form-check">
                <VField
                  id="transfer"
                  name="paymentMethod"
                  type="radio"
                  class="form-check-input"
                  rules="required"
                  v-model="paymethod"
                  value="銀行轉帳"
                />
                <label class="form-check-label" for="transfer"> 銀行轉帳 </label>
              </div>
            </div>

            <div :class="{ 'd-none': paymethod !== '銀行轉帳' }">
              <p class="my-3">ATM 轉帳繳款資料如下</p>
              <table class="table table-striped table-bordered text-dark">
                <tbody>
                  <tr>
                    <th>◆ 銀 行：</th>
                    <td>008 華南商業銀行</td>
                  </tr>
                  <tr>
                    <th>◆ 戶 名：</th>
                    <td>茶物語股份有限公司</td>
                  </tr>
                  <tr>
                    <th>◆ 帳 號：</th>
                    <td>
                      <span>123-456-123456-7</span>
                      <a href="#" @click.prevent="copyBank">
                        <span class="material-icons fs-6 ms-2"> <i class="bi bi-copy"></i> </span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="btn btn-primary btn-lg w-100" @click="payOrder">下一步</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import Swal from 'sweetalert2'
import axios from 'axios'

const store = useOrderStore()
const paymethod = ref('貨到付款') // 默认选择 "货到付款"

const order = ref({})

const route = useRoute()
const router = useRouter()

function getOrder(id) {
  axios
    .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/order/${id}`)
    .then((res) => {
      order.value = res.data.order
    })
    .catch((err) => {
      console.error(err.response)
    })
}

function payOrder() {
  axios
    .post(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/pay/${route.params.id}`
    )
    .then((res) => {
      console.log(res, res.data.message)
      store.setSelectedRadio(paymethod.value)
      router.push(`/orderfinished/${route.params.id}`)
    })
    .catch((err) => {
      console.error(err.response, '讀取訂單')
    })
}

function copyBank() {
  navigator.clipboard.writeText('1234561234567')
  Swal.fire({
    icon: 'success',
    title: '帳號已複製',
    showConfirmButton: false,
    timer: 1500
  })
}

// 创建一个 ref 变量来存储进度值
const progress = ref(50)

// 定义一个函数来更新进度值
function updateProgress(value) {
  progress.value = value
}

onMounted(() => {
  let value = 50 //從50開始
  const interval = setInterval(() => {
    if (value >= 75) {
      clearInterval(interval) // 清除定时器
    } else {
      value += 5 // 调整增量以改变进度条速度
      updateProgress(value) // 更新进度值
    }
  }, 50) // 调整时间间隔以改变进度条速度

  getOrder(route.params.id)
})

onUnmounted(() => {})
</script>
