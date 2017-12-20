import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import T from '@/components/t'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/t',
      name: 'T',
      component:T
    }

  ]
})
