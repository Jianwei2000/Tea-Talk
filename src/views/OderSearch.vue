<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>

  <div class="banner-order-search position-relative mt-5">
    <div class="container position-absolute top-50 start-50 translate-middle text-center">
      <h1 class="text-white">訂單追蹤</h1>
      <h2 class="h4 text-white">訂單編號可至Email或簡訊查看</h2>
    </div>
  </div>

  <div class="container my-6">
    <!--麵包屑-->
    <nav aria-label=" breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/" class="fw-bold text-decoration-none"
            ><i class="bi bi-house-door-fill"></i> 首頁</RouterLink
          >
        </li>
        <li class="breadcrumb-item active" aria-current="page">訂單查詢</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <div class="col-md-4">
        <VForm v-slot="{ errors, meta }" @submit="search">
          <label for="id" class="h4 my-3 text-primary fw-bold">查詢訂單</label>
          <div class="input-group mb-3">
            <VField
              v-model="inputId"
              id="id"
              name="編號"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['編號'] }"
              placeholder="輸入訂單編號"
              rules="required"
            />
            <button class="btn btn-primary rounded-1" type="submit" :disabled="!meta.valid">
              查尋
            </button>
            <ErrorMessage name="編號" class="invalid-feedback" />
          </div>
        </VForm>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-7">
        <div v-if="order.id" class="px-3 border rounded-3 shadow mt-5">
          <!-- 訂單資訊 -->
          <h4 class="border-bottom border-3 border-warning p-3 text-center text-primary fw-bold">
            訂單資訊
          </h4>
          <table class="table table-striped">
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
              <tr>
                <th>總金額</th>
                <td>NTD$ {{ $filters.currency(order.total) }} 元</td>
              </tr>
            </tbody>
          </table>
          <!-- 商品明細 -->
          <h4
            class="border-bottom border-3 border-warning p-3 pt-0 text-center text-primary fw-bold"
          >
            商品明細
          </h4>
          <table class="table table-striped">
            <tbody>
              <tr v-for="product in order.products" :key="product.id">
                <th>{{ product.product.title }}</th>
                <td>({{ product.product.category }})</td>
                <td>NT${{ $filters.currency(product.product.price) }}</td>
                <td>X {{ product.qty }}</td>
              </tr>
            </tbody>
          </table>
          <!-- 狀態追蹤 -->
          <h4
            class="border-bottom border-3 border-warning p-3 pt-0 text-center text-primary fw-bold"
          >
            狀態追蹤
          </h4>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th>訂單狀態</th>
                <td v-if="order.is_paid" class="text-success fw-bold">已成立</td>
                <td v-else class="text-danger fw-bold">未成立</td>
              </tr>
              <tr>
                <th>物流進度</th>
                <td class="text-muted">尚未出貨</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const isLoading = ref(false)

//儲存輸入的編號
const inputId = ref('')

const order = ref({})

function search() {
  isLoading.value = true
  axios
    .get(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/order/${inputId.value}`
    )
    .then((res) => {
      if (res.data.order) {
        order.value = res.data.order
        console.log(res.data)
      } else {
        Swal.fire({
          icon: 'error',
          title: '編號錯誤',
          text: '找不到訂單',
          showConfirmButton: false,
          timer: 1500
        })
      }
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err.response)
      isLoading.value = false
    })
}
</script>

<style scoped>
.banner-order-search {
  height: 280px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('https://images.unsplash.com/38/QoR8Bv1S2SEqH6UcSJCA_Tea.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
}
</style>
