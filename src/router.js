import { createRouter, createWebHistory } from 'vue-router'
import TravelHome from './views/TravelHome.vue'

// 라우트 설정
const routes = [
  {
    path: '/',
    name: 'Home',
    component: TravelHome,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue'), // 지연 로딩
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('./views/Signup.vue'), // 지연 로딩
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue'), // 지연 로딩
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
  const isAuthenticated = !!localStorage.getItem('token')

  // 인증이 필요한 페이지인지 확인
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 로그인 후 원래 페이지로 돌아갈 수 있도록 URL 저장
      })
    } else {
      next() // 인증된 사용자는 통과
    }
  } else {
    next() // 인증이 필요 없는 페이지는 모두 통과
  }
})

export default router
