<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />

  <div class="footer-dark">
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-md-3 item text-space">
            <h3>服務相關</h3>
            <ul>
              <li><RouterLink to="/products">所有商品</RouterLink></li>
              <li><RouterLink to="/about">關於我們</RouterLink></li>

              <li><RouterLink to="/qa">常見問題</RouterLink></li>
              <li><RouterLink to="/odsearch">訂單查詢</RouterLink></li>
              <li><RouterLink to="/login">進入後台</RouterLink></li>
            </ul>
          </div>
          <div class="col-sm-6 col-md-3 item text-space">
            <h3>客服相關</h3>
            <ul>
              <li><a href="tel:061234567">客服電話 : 06-1234567</a></li>
              <li><a href="mailto:teatalk@gmail.com">客服信箱 : teatalk@gmail.com</a></li>
              <li><a>服務時段 : 週一～週五 9am-6pm</a></li>
            </ul>
          </div>
          <div class="col-md-6 item text text-space">
            <h3>Tea Talk</h3>
            <p>
              中華文化博大精深，飲茶文化更是其最。<br />
              喝茶人人都會、時時刻刻都在喝茶聊天，以茶會友。<br />
              但是大家都忘記最簡單最平常的喝茶也需要學習的深奧的學問。<br />
            </p>
          </div>
          <div class="col item social">
            <a href="https://github.com/Jianwei2000" target="_blink"><i class="bi bi-github"></i></a
            ><a href="https://www.facebook.com/" target="_blink"><i class="bi bi-facebook"></i></a
            ><a href="https://www.instagram.com/" target="_blink"
              ><i class="bi bi-instagram"></i
            ></a>
          </div>
        </div>
        <p class="copyright text-space dancing-script">Tea Talk © 2024</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.text-space {
  letter-spacing: 1px;
}
.footer-dark {
  padding: 50px 0;
  color: #f0f9ff;
  background-color: #464c3a;
}

.footer-dark h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 16px;
}

.footer-dark ul {
  padding: 0;
  list-style: none;
  line-height: 1.6;
  font-size: 14px;
  margin-bottom: 0;
}

.footer-dark ul a {
  color: inherit;
  text-decoration: none;
  opacity: 0.6;
}

.footer-dark ul a:hover {
  opacity: 0.8;
}

@media (max-width: 767px) {
  .footer-dark .item:not(.social) {
    text-align: center;
    padding-bottom: 20px;
  }
}

.footer-dark .item.text {
  margin-bottom: 36px;
}

@media (max-width: 767px) {
  .footer-dark .item.text {
    margin-bottom: 0;
  }
}

.footer-dark .item.text p {
  opacity: 0.6;
  margin-bottom: 0;
}

.footer-dark .item.social {
  text-align: center;
}

@media (max-width: 991px) {
  .footer-dark .item.social {
    text-align: center;
    margin-top: 20px;
  }
}

.footer-dark .item.social > a {
  font-size: 20px;
  width: 36px;
  height: 36px;
  line-height: 34px;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
  margin: 0 8px;
  color: #fff;
  opacity: 0.75;
}

.footer-dark .item.social > a:hover {
  opacity: 0.9;
}

.footer-dark .copyright {
  text-align: center;
  padding-top: 24px;
  opacity: 0.3;
  font-size: 13px;
  margin-bottom: 0;
}
</style>
