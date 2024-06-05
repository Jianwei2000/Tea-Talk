// 千分域的方法
export function currency(num) {
  const n = parseInt(num, 10)
  return `${n
    .toFixed(0)
    .replace(/./g, (c, i, a) =>
      i && c !== '.' && (a.length - i) % 3 === 0 ? `, ${c}`.replace(/\s/g, '') : c
    )}`
}

// 將後端的date傳來的unix timestamp，轉成一般的時間格式
export function date(time) {
  const localDate = new Date(time * 1000)
  return localDate.toLocaleDateString()
}
