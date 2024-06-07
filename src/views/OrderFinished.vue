<template>
  <div class="container my-8">
    <div class="row my-3 text-center fs-6">
      <div class="col-4 text-primary fw-bold">1.購物清單</div>
      <div class="col-4 text-primary fw-bold">2.填寫資料</div>
      <div class="col-4 text-primary fw-bold">3.完成訂單</div>
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
        <button
          class="btn btn-outline-dark rounded-0"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          查看明細
        </button>
        <h2 class="text-center xl-icon">
          <i class="bi bi-bag-check-fill"></i>
        </h2>
        <h3 class="text-center fs-3 fw-bold my-4">訂單已成立</h3>

        <p class="text-center">
          已收到您的訂單，感謝您的訂購!<br />
          貨到付款之商品將於1~2個工作天寄出，請留意簡訊通知或配送人員的電話!<br />
          銀行轉帳之商品需在24小時內完成付款，完成付款後商品將於1~2個工作天寄出!
        </p>
        <!-- 明細 -->
        <div class="collapse" id="collapseExample">
          <div class="border mt-5">
            <table class="table">
              <tbody>
                <tr>
                  <th>訂單時間</th>
                  <td class="">
                    <span class="me-2">
                      {{ new Date(order.paid_date * 1000).toLocaleDateString() }}
                    </span>
                    <small class="text-muted fs-md-6 d-none d-sm-inline">{{
                      new Date(order.paid_date * 1000).toLocaleTimeString()
                    }}</small>
                  </td>
                </tr>
                <tr>
                  <th>訂單編號</th>
                  <td class="">
                    <div class="d-flex align-items-center">
                      {{ order.id }}
                    </div>
                  </td>
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
                <tr class="border-0 border-bottom border-3 border-dark">
                  <th>總金額</th>
                  <td>NTD$ {{ $filters.currency(order.total) }} 元</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>付款方式</th>
                  <td>
                    {{ selectedRadio }}
                  </td>
                </tr>
                <tr v-if="selectedRadio === '銀行轉帳'">
                  <td class="text-center" colspan="2">
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
                              <span class="material-icons fs-6 ms-2">
                                <i class="bi bi-copy"></i>
                              </span>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-center" colspan="3">
                            <small class="fs-6 text-danger"
                              >***提醒您，選擇轉帳之訂單需於24小時內完成付款，謝謝您的支持***</small
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr v-if="selectedRadio === '貨到付款'">
                  <td class="text-center" colspan="2">
                    <small class="fs-6 text-danger"
                      >***您訂購的商品將在近期安排出貨，請留意簡訊通知或配送人員的電話***</small
                    >
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="text-end">
          <button class="btn btn-primary btn-lg mt-4" @click="goProducts">繼續選購</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import axios from 'axios'
import Swal from 'sweetalert2'

const store = useOrderStore()
const selectedRadio = computed(() => store.selectedRadio)

const route = useRoute()
const router = useRouter()

const order = ref({})

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

// 创建一个 ref 变量来存储进度值
const progress = ref(75)

// 定义一个函数来更新进度值
function updateProgress(value) {
  progress.value = value
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

function goProducts() {
  router.push('/products')
}

onMounted(() => {
  let value = 75 //從75開始
  const interval = setInterval(() => {
    if (value >= 100) {
      clearInterval(interval) // 清除定时器
    } else {
      value += 5 // 调整增量以改变进度条速度
      updateProgress(value) // 更新进度值
    }
  }, 50) // 调整时间间隔以改变进度条速度

  getOrder(route.params.id)
})
</script>

<style>
.xl-icon {
  font-size: 5rem;
}
</style>
