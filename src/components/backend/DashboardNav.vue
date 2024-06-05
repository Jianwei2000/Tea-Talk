<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />

  <div class="bg-dark">
    <div class="d-flex justify-content-between">
      <!-- 電腦裝置 -->
      <div
        class="sidebar-head col-md-2 text-white d-none d-md-block text-decoration-none text-center py-2"
      >
        <i class="bi bi-gear-fill"></i>
        後台管理
      </div>

      <!-- 手機裝置 -->
      <div class="dropdown d-md-none" @click="toggleDropdown">
        <button class="btn btn-dark dropdown-toggle rounded-0" type="button" aria-expanded="false">
          <i class="bi bi-gear-fill"></i>
          後台管理
        </button>
        <ul
          class="dropdown-menu fs-4 shadow rounded-0"
          :class="{ show: isDropdownOpen }"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <router-link class="dropdown-item" to="/admin"
              ><i class="bi bi-box-seam"></i> 商品管理</router-link
            >
          </li>
          <li>
            <router-link class="dropdown-item" to="/admin/order"
              ><i class="bi bi-list-check"></i> 訂單管理</router-link
            >
          </li>
          <li>
            <router-link class="dropdown-item" to="/admin/coupon"
              ><i class="bi bi-ticket-detailed"></i> 優惠碼管理</router-link
            >
          </li>
        </ul>
      </div>

      <a class="btn text-white fw-bold px-4" type="button" @click.prevent="signOut"> 登出 </a>
    </div>
  </div>
</template>

<style scoped>
.sidebar-head {
  background-color: #51585e;
  border-right: 1px gray solid;
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

const router = useRouter()

function signOut() {
  Swal.fire({
    title: '是否要登出?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      // 清除cookie
      document.cookie = 'TeaTalkToken=; expires=;'
      // 回到login畫面
      router.push('/login')
    }
  })
}
</script>
