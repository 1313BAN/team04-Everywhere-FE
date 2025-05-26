import { createRouter, createWebHistory } from 'vue-router'

// 라우트 설정
// views folder
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/TravelHome.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), // 지연 로딩
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/Map.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'), // 지연 로딩
    meta: {
      requiresAuth: true, // 인증 필요 페이지
    },
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('@/views/Board.vue'),
  },
  {
    path: '/board/write',
    name: 'BoardCreate',
    component: () => import('@/views/BoardCreate.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/board/edit/:id',
    name: 'BoardEdit',
    component: () => import('@/views/BoardEdit.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/board/:id',
    name: 'BoardDetail',
    component: () => import('@/views/BoardDetail.vue'),
    meta: { requiresAuth: true },
  },
  // 페이지를 찾지 못할 경우 홈으로 리다이렉트 (마지막에 위치)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 네비게이션 가드: 인증이 필요한 페이지 처리
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken') // 토큰 확인

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
