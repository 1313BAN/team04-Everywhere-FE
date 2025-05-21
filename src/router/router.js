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
    component: () => import('../views/Login.vue'), // 지연 로딩
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/Map.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'), // 지연 로딩
    meta: {
      requiresAuth: true, // 인증 필요 페이지
    },
  },
  // 페이지를 찾지 못할 경우 홈으로 리다이렉트
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
  const isAuthenticated = !!localStorage.getItem('accessToken') // 키 이름 수정

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
