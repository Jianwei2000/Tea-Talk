<script setup>
import RandomSwiper from '@/components/RandomSwiper.vue'
// 使用 ES 模組的導入語法來導入圖片
import banner from '@/assets/images/banner.jpg'
import tea from '@/assets/images/tea.jpg'
import teaBag from '@/assets/images/teaBag.jpg'
import teaSet from '@/assets/images/teaSet.jpg'

import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(false)

const router = useRouter()
const inputEmail = ref('')
const couponCode = ref('TEA_TALK_2024')

function subscribe() {
  isLoading.value = true
  inputEmail.value = ''
  setTimeout(() => {
    isLoading.value = false
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '已獲得優惠碼',
      html: `優惠碼：${couponCode.value}`,
      confirmButtonText: '複製並前往選購',
      confirmButtonColor: '#464C3A',
      showCancelButton: true,
      cancelButtonText: '取消',
      cancelButtonColor: '#F75000',
      reverseButtons: true,
      showClass: {
        popup: `
          animate__animated
          animate__slideInDown
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutUp
        `
      }
    }).then((res) => {
      if (res.isConfirmed) {
        copyCoupon()
        router.push('/products')
      }
    })
  }, 1000) // 延遲 1 秒
}

function copyCoupon() {
  navigator.clipboard.writeText(couponCode.value)
  Swal.fire({
    position: 'top',
    icon: 'success',
    title: '代碼已複製',
    showConfirmButton: false,
    timer: 1000
  })
}
</script>

<template>
  <VLoading :active="isLoading">
    <div class="loader-container">
      <!-- 使用你自定义的加载动画 -->
      <div class="loader"></div>
      <div class="text-white text-center fs-4 mt-2">喝杯熱茶，稍等片刻 ~ ~</div>
    </div>
  </VLoading>
  <!--banner-->
  <div class="banner my-5 position-relative" :style="{ 'background-image': 'url(' + banner + ')' }">
    <div class="position-absolute start-50 top-50 translate-middle text-white banner-title">
      <h1 class="title dancing-script">Tea Talk</h1>
      <p class="fs-6 mt-3">喝茶是學問、更是藝術。與您一同品嘗茶．物語</p>
    </div>
    <RouterLink to="/products">
      <button
        type="button"
        class="mt-3 cta-btn btn fs-5 text-white border-white border-3 rounded-3 px-4 position-absolute start-50 translate-middle"
      >
        開始品茶!
      </button>
    </RouterLink>
  </div>

  <!--介紹-->
  <div class="container mt-6">
    <div class="row">
      <!--茶葉-->
      <div class="d-md-flex">
        <div class="d-flex flex-column justify-content-center align-items-center col-md-6">
          <h2 class="fs-2 text-primary fw-bold text-title">
            茶葉 <span class="fs-5 dancing-script">Tea</span>
          </h2>
          <h3 class="text-dark lh-lg my-3 fs-6 text-space">
            豐富多元的茶樹品種，<br />
            得天獨厚的生長環境，<br />
            百年來與時並進的製茶工藝。
          </h3>
        </div>
        <div
          class="category-img shadow col-md-6 my-5"
          :style="{ 'background-image': 'url(' + tea + ')' }"
        ></div>
      </div>
      <!--茶包-->
      <div class="d-md-flex flex-md-row-reverse">
        <div class="d-flex flex-column justify-content-center align-items-center col-md-6">
          <h2 class="fs-2 text-primary fw-bold text-title">
            茶包 <span class="fs-5 dancing-script">Tea Bag</span>
          </h2>
          <h3 class="text-dark lh-lg my-3 fs-6 text-space">
            生活前行，風味隨行，<br />
            為每一天注入滿滿正能量。
          </h3>
        </div>
        <div
          class="category-img shadow col-md-6 my-5"
          :style="{ 'background-image': 'url(' + teaBag + ')' }"
        ></div>
      </div>

      <!--茶具-->
      <div class="d-md-flex">
        <div class="d-flex flex-column justify-content-center align-items-center col-md-6">
          <h2 class="fs-2 text-primary fw-bold text-title">
            茶具 <span class="fs-5 dancing-script">Tea Set</span>
          </h2>
          <h3 class="text-dark lh-lg my-3 fs-6 text-space">
            極佳品質，輕鬆上手，<br />
            泡一杯茶不再是難事，<br />
            讓你的品茶饗宴更襯完美。
          </h3>
        </div>

        <div
          class="category-img shadow col-md-6 my-5"
          :style="{ 'background-image': 'url(' + teaSet + ')' }"
        ></div>
      </div>
    </div>
  </div>

  <!-- 精選推薦 輪播 -->
  <div class="container mt-5 products-selected">
    <h2 class="fs-2 text-primary fw-bold mb-5">
      精選推薦 <span class="fs-5 dancing-script">Selected</span>
    </h2>
    <RandomSwiper />
    <div class="text-center my-5">
      <RouterLink class="btn btn-primary btn-lg p-3 shadow" to="/products">查看更多</RouterLink>
    </div>
  </div>

  <!-- 訂閱優惠 -->

  <div class="sub-img mt-5">
    <div class="container">
      <div class="row py-5">
        <div class="col-md-6 col-lg-4">
          <h2 class="fs-2 text-white fw-bold">
            訂閱我們 <span class="fs-5 dancing-script">Subscribe</span>
          </h2>
          <VForm v-slot="{ errors, meta }" class="" @submit="subscribe">
            <label for="email" class="h4 my-3 text-white">獲取第一手商品資訊</label>
            <p class="fs-6 mb-3 text-warning">立即訂閱，即可領取折扣優惠碼</p>
            <div class="input-group mb-3">
              <VField
                v-model="inputEmail"
                id="email"
                name="信箱"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors['Email'] }"
                placeholder="輸入信箱取得優惠"
                rules="email|required"
              />
              <button class="btn btn-danger rounded-1" type="submit" :disabled="!meta.valid">
                訂閱
              </button>
              <ErrorMessage name="信箱" class="invalid-feedback" />
            </div>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.text-space {
  letter-spacing: 1px;
}
.banner {
  height: calc(100vh - 200px);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
}
.title {
  font-size: 80px;
  font-weight: 600;
  text-align: center;
}
.cta-btn {
  top: 64%;
}

.category-img {
  height: 25rem;
  border-radius: 1rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.sub-img {
  height: 300px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1531967802777-e0f8fc276609?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
@media (max-width: 576px) {
  .title {
    font-size: 50px;
  }
  .cta-btn {
    top: 70%;
  }
}
</style>
