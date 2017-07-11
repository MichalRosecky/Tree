
import Vue from 'vue'
import App from './App'
import router from './router'
//import testItem from './components/tree/testItem'
//import 'expose-loader?$!expose-loader?jQuery!jquery'
Vue.config.productionTip = false

//Vue.component('testItem', testItem);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
//
// import VueDragSortTree from './components/tree/tree.vue'
// export default VueDragSortTree;
