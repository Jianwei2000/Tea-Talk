import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory('/Tea-Talk/'),
  routes: [
    //前台
    {
      path: '/',
      component: () => import('../views/FrontView.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'products',
          component: () => import('../views/ProductsView.vue')
        },
        {
          path: 'about',
          component: () => import('../views/AboutView.vue')
        },

        {
          path: 'qa',
          component: () => import('../views/QAView.vue')
        },
        {
          path: 'login',
          component: () => import('../views/LoginView.vue')
        },
        {
          path: 'favorite',
          component: () => import('../views/FavoriteView.vue')
        },
        {
          path: 'cart',
          component: () => import('../views/CartView.vue')
        },
        {
          path: 'product/:id',
          component: () => import('../views/ProductView.vue')
        },
        {
          path: 'checkorder',
          component: () => import('../views/CheckOrder.vue')
        },
        {
          path: 'checkout/:id',
          component: () => import('../views/CheckOut.vue')
        },
        {
          path: 'orderfinished/:id',
          component: () => import('../views/OrderFinished.vue')
        }
      ]
    },
    //後台
    {
      path: '/admin',
      component: () => import('../views/backend/DashboardView.vue'),
      children: [
        {
          path: '',
          component: () => import('../views/backend/AdminProducts.vue')
        },
        {
          path: 'coupon',
          component: () => import('../views/backend/AdminCoupon.vue')
        },
        {
          path: 'order',
          component: () => import('../views/backend/AdminOrder.vue')
        }
      ]
    }
  ],
  // 切換頁面時滾至頂部
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router
