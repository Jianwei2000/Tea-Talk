<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h3 class="fw-bold"><i class="bi bi-list-check"></i> 訂單列表</h3>
    </div>
    <table class="table table-striped mt-4 text-dark">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th class="d-none d-md-table-cell">下單時間</th>
          <th>訂單狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td class="text-truncate">
            {{ item.id }}
          </td>
          <td class="d-none d-md-table-cell">
            <i class="text-muted small">
              訂單時間:
              {{ new Date(item.create_at * 1000).toLocaleDateString() }}
            </i>
          </td>
          <td :class="{ 'text-muted': !item.is_paid }">
            <i v-if="item.is_paid" class="fw-bold text-success"> 已成立</i>
            <i v-else> 未成立</i>
          </td>
          <td>
            <button
              class="btn btn-dark btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#orderModal"
              @click="openDetail(item)"
            >
              查看明細
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationCom :pages="pagination" @get-page="getOrders" />
    <!-- orderModal -->
    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>訂單明細</span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-10 mx-auto my-2">
                <div class="text-muted mb-2">訂單編號:</div>
                <div>{{ order.id }}</div>
              </div>
              <div class="col-10 mx-auto my-2">
                <i>
                  {{ new Date(order.create_at * 1000).toLocaleDateString() }}
                </i>
              </div>
              <div class="col-10 mx-auto my-2">
                <div class="text-muted mb-2">訂購人資訊:</div>
                <div>
                  訂購人: {{ order.user.name }} <br />
                  email: {{ order.user.email }} <br />
                  連絡電話: {{ order.user.tel }} <br />
                  地址: {{ order.user.address }}
                </div>
              </div>

              <div class="col-10 mx-auto my-2">
                <div class="text-muted mb-2">購買清單:</div>
                <div class="" v-for="product in order.products" :key="product.id">
                  {{ product.product.title }}
                  NT${{ $filters.currency(product.product.price) }} x
                  {{ product.qty }}
                </div>
                <hr />
                總金額：NT${{ $filters.currency(order.total) }}
              </div>
              <div class="col-10 mx-auto my-2">
                <div class="text-muted mb-2">訂單狀態:</div>
                <div class="text-dark" :class="{ 'text-muted': order.is_paid === false }">
                  <i v-if="order.is_paid" class="fw-bold text-success"> 已成立</i>
                  <i v-else> 未成立</i>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal" aria-label="Close">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PaginationCom from '@/components/PaginationCom.vue'
import axios from 'axios'

const isLoading = ref(false)
const orders = ref([])
const pagination = ref({})

function getOrders(page = 1) {
  isLoading.value = true
  axios
    .get(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/orders?page=${page}`
    )
    .then((res) => {
      console.log(res.data)
      orders.value = res.data.orders
      pagination.value = res.data.pagination
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err.response)
      isLoading.value = false
    })
}

const order = ref({
  user: {
    name: '',
    email: '',
    tel: '',
    address: ''
  }
})
function openDetail(item) {
  order.value = item
}

onMounted(() => {
  getOrders()
})
</script>

<style>
@media (max-width: 768px) {
  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
}
</style>
