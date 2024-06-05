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
      <h3 class="fw-bold"><i class="bi bi-ticket-detailed"></i> 優惠碼列表</h3>

      <button class="btn btn-dark mb-4" type="button" @click="couponModal(true)">
        建立新的優惠
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped mb-4">
        <thead>
          <tr>
            <th>名稱</th>
            <th class="d-none d-md-table-cell">優惠碼</th>
            <th>折扣</th>
            <th>期限</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in coupons" :key="item.id">
            <td>{{ item.title }}</td>
            <td class="d-none d-md-table-cell">{{ item.code }}</td>
            <td>{{ item.percent }}% off</td>
            <td>{{ new Date(item.due_date).toLocaleDateString() }} 截止</td>

            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-outline-dark btn-sm"
                  @click="couponModal(false, item)"
                >
                  編輯
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelCoupon(item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationCom :pages="pagination" @get-page="getCoupons" />

    <!-- couponModal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增優惠</span>
              <span v-else>編輯優惠</span>
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
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">優惠券名稱</label>
                  <input
                    type="text"
                    class="form-control my-2"
                    id="title"
                    placeholder="請輸入名稱"
                    v-model="tempCoupon.title"
                  />
                </div>

                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="percent">折扣百分比</label>
                    <input
                      type="number"
                      class="form-control my-2"
                      id="percent"
                      placeholder="請輸入百分比"
                      v-model.number="tempCoupon.percent"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="due_date">到期日</label>
                    <input
                      type="date"
                      class="form-control my-2"
                      id="due_date"
                      placeholder="請輸入到期日"
                      v-model="tempCoupon.due_date"
                    />
                  </div>
                </div>
                <hr />
                <div class="form-group">
                  <label for="code">優惠碼</label>
                  <input
                    type="text"
                    class="form-control my-2"
                    id="code"
                    placeholder="請輸入優惠碼"
                    v-model="tempCoupon.code"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              取消
            </button>
            <button type="button" class="btn btn-dark" @click="updateCoupon(tempCoupon)">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delCoupon -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="delModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="delModalLabel">
              <span>刪除優惠</span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="text-center modal-body fs-3">
            是否刪除優惠碼

            <strong class="text-light bg-info p-1 rounded-3">
              {{ tempCoupon.code }}
            </strong>
            <br />
            (刪除後將無法恢復)
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-outline-danger" @click="deleteCoupon()">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PaginationCom from '@/components/PaginationCom.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Modal from 'bootstrap/js/dist/modal'

const isLoading = ref(false)

const pagination = ref({})
const coupons = ref([])

function getCoupons(page = 1) {
  isLoading.value = true
  axios
    .get(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/coupons?page=${page}`
    )
    .then((res) => {
      coupons.value = res.data.coupons
      pagination.value = res.data.pagination
      console.log(res.data)
      isLoading.value = false
    })
    .catch((err) => {
      console.error(err.response)
      isLoading.value = false
    })
}

//打開modal
const tempCoupon = ref({})
const isNew = ref(false)

function couponModal(isNewItem, item = {}) {
  const couponModal = new Modal(document.getElementById('couponModal'))

  isNew.value = isNewItem
  if (isNewItem) {
    tempCoupon.value = {}
  } else {
    tempCoupon.value = { ...item }
  }
  couponModal.show()
}

//編輯優惠

function updateCoupon() {
  let Capi = `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/coupon`
  let httpMethod = 'post'
  //取得 couponModal的id
  const modalElement = document.getElementById('couponModal')

  //編輯狀態（加入判斷式，如果不是新增品項的話）
  if (!isNew.value) {
    // api為修改商品的api，後面要加id
    Capi = `${Capi}/${tempCoupon.value.id}`
    httpMethod = 'put'
  }
  tempCoupon.value.due_date = Date.parse(tempCoupon.value.due_date)

  // 將 is_enabled 的值也包含在要發送的數據對象中
  tempCoupon.value.is_enabled = 1
  // 使用 axios 發送請求
  axios({
    method: httpMethod,
    url: Capi,
    data: { data: tempCoupon.value }
  })
    .then((res) => {
      Swal.fire({
        icon: 'success',
        title: '優惠編輯成功',
        showConfirmButton: false,
        timer: 1500
      })
      // 获取模态框实例并调用 hide 方法
      const couponModal = Modal.getInstance(modalElement)
      if (couponModal) {
        couponModal.hide()
      }
      console.log(res)
      getCoupons()
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '優惠建立失敗',
        text: err.response.data.message
      })
      console.error(err.response)
    })
}
//刪除優惠
function openDelCoupon(item) {
  const delCouponModal = new Modal(document.getElementById('delCouponModal'))

  tempCoupon.value = { ...item }
  delCouponModal.show()
}
function deleteCoupon() {
  //取得 delCouponModal的id
  const modalElement = document.getElementById('delCouponModal')
  axios
    .delete(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/coupon/${tempCoupon.value.id}`
    )
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: '已刪除優惠',
        showConfirmButton: false,
        timer: 1500
      })
      // 获取模态框实例并调用 hide 方法
      const delCouponModal = Modal.getInstance(modalElement)
      if (delCouponModal) {
        delCouponModal.hide()
      }
      getCoupons()
    })
    .catch((err) => {
      console.error(err.response)
    })
}
onMounted(() => {
  getCoupons()
})
</script>
