<template>
  <div>
    <swiper
      :modules="modules"
      :space-between="50"
      :navigation="true"
      :pagination="false"
      :breakpoints="swiper.breakpoints"
      autoplay
    >
      <swiper-slide v-for="item in randomProducts" :key="item.id" class="swiper-slide">
        <div class="card border-width h-100">
          <RouterLink :to="`/product/${item.id}`">
            <div
              class="swiper-slide-inner"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </RouterLink>
          <div class="card-body d-flex justify-content-between">
            <h2 class="product-title fw-bold">{{ item.title }}</h2>
            <p class="product-price fw-bold text-primary">NT$ {{ item.price }}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  components: { Swiper, SwiperSlide },

  data() {
    return {
      products: [],
      randomProducts: [],
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow],
      swiper: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50
          }
        }
      }
    }
  },
  methods: {
    getProductsList() {
      this.$http
        .get(`${import.meta.env.VITE_APP_API}v2/api/${import.meta.env.VITE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products
          this.getRandomProducts()
        })
        .catch((err) => {
          this.$httpMessageState(err.response, err.response.data.message)
        })
    },
    getRandomProducts() {
      if (this.$route.params.id) {
        const productItemId = this.$route.params.id
        this.randomProducts = this.products.filter((item) => item.id !== productItemId)
      } else {
        this.randomProducts = this.products
      }
      for (let i = this.randomProducts.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[this.randomProducts[i], this.randomProducts[j]] = [
          this.randomProducts[j],
          this.randomProducts[i]
        ]
      }
      this.randomProducts = this.randomProducts.splice(0, 10)
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'product') {
        this.getProductsList()
      }
    }
  },
  mounted() {
    this.getProductsList()
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  --swiper-navigation-color: #ffff; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 48px; /* 设置按钮大小 */
}
.swiper-slide {
  height: 21rem;
  .card {
    background-color: #ffffff;
    border-radius: 1rem;

    .swiper-slide-inner {
      border-radius: 1rem;
      height: 17rem;
      background-position: center center;
      background-size: cover;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
.product-title {
  font-size: 0.8rem;
}
@media screen and (min-width: 1200px) {
  .product-title {
    font-size: 1.2rem;
  }
}
.product-price {
  font-size: 0.8rem;
}
@media screen and (min-width: 1200px) {
  .product-price {
    font-size: 1.2rem;
  }
}
</style>
