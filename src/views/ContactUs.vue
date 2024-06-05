<script setup></script>

<template>
  <div class="container my-7">
    <!--麵包屑-->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/" class="fw-bold text-decoration-none"
            ><i class="bi bi-house-door-fill"></i> 首頁</RouterLink
          >
        </li>
        <li class="breadcrumb-item active" aria-current="page">聯絡我們</li>
      </ol>
    </nav>

    <!--表單-->
    <form class="body mt-5 rounded-3 shadow row">
      <h1 class="text-primary fw-bold text-center fs-2 text-title">聯絡我們</h1>
      <h2 class="text-center lh-lg text-muted py-3 fs-6">
        若有任何問題，歡迎透過表單與我們聯繫，我們將於服務時段儘速聯絡您！<br />
        您也可以試著在
        <RouterLink class="text-decoration-underline" to="/qa">常見問答</RouterLink>
        找到相關答案
      </h2>
      <div class="col-md-6">
        <!--姓名-->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="name" placeholder="請輸入姓名" required />
          <label for="name"><span class="text-danger">* </span>姓名</label>
        </div>
        <!--email-->
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="name@example.com"
            required
          />
          <label for="email"><span class="text-danger">* </span>Email</label>
        </div>
        <!--電話-->
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="tel" placeholder="請輸入電話" required />
          <label for="tel"><span class="text-danger">* </span>連絡電話</label>
        </div>
      </div>
      <!--訊息-->
      <div class="col-md-6">
        <div class="form-floating">
          <textarea
            class="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style="height: 200px"
            required
          ></textarea>
          <label for="floatingTextarea2"><span class="text-danger">* </span>留下訊息</label>
        </div>
      </div>
      <!--送出按鈕-->
      <div class="mt-4 d-flex justify-content-between">
        <p class="fs-8 text-muted d-flex align-items-end">服務時段：週一~週五 09:00-18:00</p>
        <button type="submit" class="btn btn-primary text-white fs-7">送出</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.body {
  background-image: url(../assets/images/test.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  padding: 6rem 8rem;
}
.text-title {
  text-shadow: 1px 1px #d7ebb1;
}
</style>
