import {
  createRouter,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '../views/AddBookView.vue'
import WeatherView from '../views/WeatherView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import GetAllBookAPIView from '../views/GetAllBookAPIView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/firebase-register',
    name: 'FirebaseRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: FirebaseSigninView
  },
  {
    path: '/firebase-logout',
    name: 'FirebaseLogout',
    component: FirebaseLogoutView
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView
  },
  {
    path: '/getbookcount',
    name: 'GetBookCount',
    component: GetBookCountView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
  path: '/GetAllBookAPI',
  name: 'GetAllBookAPI',
  component: GetAllBookAPIView
}
]

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  routes
})

export default router
