<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <div class="d-none d-md-block side-bar">
    <ul class="nav text-left fw-bolder fs-6 m-5">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/admin"
          ><i class="bi bi-box-seam"></i> 商品管理
        </RouterLink>
        <RouterLink class="nav-link" to="/admin/order">
          <i class="bi bi-list-check"></i> 訂單管理
        </RouterLink>
        <RouterLink class="nav-link" to="/admin/coupon"
          ><i class="bi bi-ticket-detailed"></i> 優惠碼管理
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.side-bar {
  height: calc(100vh - 40px);
  background-color: #f8f9fa;
  border: #dfe0e1 1px solid;
}
</style>
