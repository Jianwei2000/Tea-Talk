<template>
  <DashboardNav />
  <div class="row gx-0">
    <div class="col-md-2">
      <DashboardSideBar />
    </div>
    <div class="col">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import DashboardNav from '@/components/backend/DashboardNav.vue'
import DashboardSideBar from '@/components/backend/DashboardSideBar.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginCheck = ref(false)

function checkLogin() {
  //取出token
  const myToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)TeaTalkToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  if (myToken) {
    axios.defaults.headers.common['Authorization'] = myToken
    // 將api替換成登入驗證的路徑
    const api = `${import.meta.env.VITE_APP_API}v2/api/user/check`

    axios
      .post(api)
      .then(() => {
        loginCheck.value = true
      })
      .catch((err) => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: '請重新登入!'
        })
        router.push('/login')
      })
  } else {
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      text: '請重新登入!'
    })
    router.push('/login')
  }
}

onMounted(() => {
  checkLogin()
})
</script>
