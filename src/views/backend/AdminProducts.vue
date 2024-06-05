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
      <h3 class="fw-bold"><i class="bi bi-box-seam"></i> 商品列表</h3>

      <button class="btn btn-dark mb-4" type="button" @click="prepareModal(true)">
        建立新的商品
      </button>
    </div>
    <!-- 表格 -->
    <div class="table-responsive">
      <table class="table table-striped mb-4">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th class="d-none d-md-table-cell">分類</th>
            <th class="d-none d-md-table-cell">原價</th>
            <th>售價</th>
            <th>是否啟用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.title }}</td>
            <td class="d-none d-md-table-cell">{{ item.category }}</td>
            <td class="d-none d-md-table-cell">NT${{ $filters.currency(item.origin_price) }}</td>
            <td>NT${{ $filters.currency(item.price) }}</td>
            <td>
              <span class="text-success" v-if="item.is_enabled">啟用</span>
              <span class="text-danger" v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-outline-dark btn-sm"
                  @click="prepareModal(false, item)"
                >
                  編輯
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="openDelModal(item)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationCom :pages="pagination" @get-page="getProducts" />
    <!--ProductModal-->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
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
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="image" class="form-label h3">商品圖片</label>
                  <input
                    v-model="tempProduct.imageUrl"
                    id="image"
                    type="text"
                    class="form-control mb-2"
                    placeholder="請輸入圖片連結"
                  />
                  <label for="fileInput" class="form-label"> 或 上傳圖片 </label>
                  <input
                    type="file"
                    class="form-control mb-2"
                    @change="upLoadImage"
                    ref="files"
                    id="fileInput"
                  />
                  <img class="img-fluid" :src="tempProduct.imageUrl" />
                </div>
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input
                    id="title"
                    v-model="tempProduct.title"
                    type="text"
                    class="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">分類</label>
                    <input
                      id="category"
                      v-model="tempProduct.category"
                      type="text"
                      class="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">庫存</label>
                    <input
                      id="unit"
                      v-model="tempProduct.unit"
                      type="text"
                      class="form-control"
                      placeholder="請輸入庫存"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">原價</label>
                    <input
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      type="number"
                      min="0"
                      class="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">售價</label>
                    <input
                      id="price"
                      v-model="tempProduct.price"
                      type="number"
                      min="0"
                      class="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <hr />

                <div class="mb-3">
                  <label for="description" class="form-label">商品描述</label>
                  <textarea
                    id="description"
                    v-model="tempProduct.description"
                    type="text"
                    class="form-control"
                    placeholder="請輸入商品描述"
                    style="min-height: 150px"
                  >
                  </textarea>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入商品說明內容"
                  ></textarea>
                </div>
                <div class="mb-3">
                  <div class="form-check form-switch">
                    <input
                      id="flexSwitchCheckChecked"
                      v-model="tempProduct.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="flexSwitchCheckChecked">是否啟用</label>
                  </div>
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
            <button type="button" class="btn btn-dark" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!--DelMoodal-->
    <div
      class="modal fade"
      id="delModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除商品</span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="text-center fs-3">
              是否刪除
              <strong class="text-light bg-info p-1 rounded-3">
                {{ tempProduct.title }}
              </strong>
              商品
              <br />
              (刪除後將無法恢復)
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              取消
            </button>
            <button type="button" class="btn btn-outline-danger" @click="deleteProduct">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import PaginationCom from '@/components/PaginationCom.vue'
import Swal from 'sweetalert2'
import Modal from 'bootstrap/js/dist/modal'

const isLoading = ref(false)

const products = ref([])
const pagination = ref({})

//獲取商品數據
function getProducts(page = 1) {
  isLoading.value = true
  axios
    .get(
      `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/products?page=${page}`
    )
    .then((res) => {
      // 儲存產品資料與分頁資訊
      products.value = res.data.products
      pagination.value = res.data.pagination
      console.log(res.data)
      isLoading.value = false
    })
    .catch((error) => {
      console.error('錯誤訊息:', error.response)
      isLoading.value = false
    })
}
//打開modal
const tempProduct = ref({})
const isNew = ref(false)

// 打开 modal 的函数
function openProductModal() {
  const productModal = new Modal(document.getElementById('productModal'))
  productModal.show()
}

function prepareModal(isNewItem, item = {}) {
  isNew.value = isNewItem
  if (isNewItem) {
    tempProduct.value = {}
  } else {
    tempProduct.value = { ...item }
  }
  openProductModal()
}

//編輯商品
function updateProduct() {
  isLoading.value = true
  let api = `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/product`
  let httpMethod = 'post'
  let status = '新增產品'
  //取得 productModal的id
  const modalElement = document.getElementById('productModal')
  //編輯狀態（加入判斷式，如果不是新增品項的話）
  if (!isNew.value) {
    // api為修改商品的api，後面要加id
    api = `${api}/${tempProduct.value.id}`
    httpMethod = 'put'
    status = '更新產品'
  }

  // 使用 axios 發送請求
  axios({
    method: httpMethod,
    url: api,
    data: { data: tempProduct.value }
  })
    .then((res) => {
      Swal.fire({
        icon: 'success',
        title: '商品編輯成功',
        showConfirmButton: false,
        timer: 1500
      })
      // 获取模态框实例并调用 hide 方法
      const productModal = Modal.getInstance(modalElement)
      if (productModal) {
        productModal.hide()
      }

      isLoading.value = false

      console.log(res)
      getProducts()
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '商品建立失敗',
        text: err.response.data.message,
        status
      })
      isLoading.value = false
      console.error(err.response, status)
    })
}

//上傳圖片

const status = reactive({ imgUploading: false })
const files = ref(null)

function upLoadImage() {
  tempProduct.value.imageUrl = ''
  status.imgUploading = true
  const img = files.value.files[0]
  const formData = new FormData()
  formData.append('file-to-upload', img)
  const api = `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/upload`
  axios
    .post(api, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      status.imgUploading = false
      if (res.data.success) {
        tempProduct.value.imageUrl = res.data.imageUrl
      } else {
        Swal.fire({
          icon: 'error',
          title: '圖片上傳失敗',
          text: res.data.message
        })
      }
    })
    .catch((error) => {
      status.imgUploading = false
      console.error(error.response || error)
    })
}

//刪除商品

function openDelModal(item) {
  tempProduct.value = { ...item }
  const delModal = new Modal(document.getElementById('delModal'))
  delModal.show()
}

function deleteProduct() {
  let api = `${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/admin/product/${tempProduct.value.id}`
  //取得 productModal的id
  const modalElement = document.getElementById('delModal')

  axios
    .delete(api)
    .then((res) => {
      // 获取模态框实例并调用 hide 方法
      const delModal = Modal.getInstance(modalElement)
      if (delModal) {
        delModal.hide()
      }
      Swal.fire({
        icon: 'success',
        title: '已刪除商品',
        showConfirmButton: false,
        timer: 1500
      })

      console.log(res)
      getProducts()
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: '刪除商品失敗',
        text: err.response.data.message,
        status
      })
      console.error(err.response)
    })
}

onMounted(() => {
  getProducts()
})
</script>

<style></style>
