const CACHE_NAME = 'image-cache-v1'
const urlsToCache = []

// 定义要匹配的正则表达式
const imageRegex = /\.(png|jpg|jpeg|gif|svg)$/

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)

  // 排除不支持的 URL scheme
  if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
    if (imageRegex.test(requestUrl.pathname)) {
      event.respondWith(
        caches.match(event.request).then(response => {
          if (response) {
            return response
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache)
            })
            return response
          })
        })
      )
    } else {
      event.respondWith(fetch(event.request))
    }
  } else {
    event.respondWith(fetch(event.request))
  }
})
