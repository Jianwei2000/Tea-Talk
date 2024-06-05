<template>
  <!-- :class="{disabled: !pages.has_pre} 沒有上一頁的時候disable(在第一頁時不會有上一頁)
  @click="$emit('get-page', pages.current_page - 1)" 點擊前一頁按鈕 等於當前頁數-1 -->
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <!--上一頁-->
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="getPages(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!--數字-->
      <li class="page-item" v-for="item in pages.total_pages" :key="item">
        <a class="page-link" href="#" @click.prevent="getPages(item)">
          {{ item }}
        </a>
      </li>
      <!--下一頁-->
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a
          class="page-link"
          href="#"
          @click.prevent="getPages(pages.current_page + 1)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  pages: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['get-page'])

function getPages(num) {
  emit('get-page', num)
}
</script>
