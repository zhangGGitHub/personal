import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uniFly from 'unifly';

// uniFly.baseUrl = 'https://dfl.yinshangjituan.com/app';

uniFly.baseUrl = 'http://adzcc.com:9999/app';

// uniFly.baseUrl = 'http://281s5457y3.qicp.vip:40272/app';

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)


uniFly.headers['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.prototype.uniFly = uniFly

const app = new Vue({
	...App
})

app.$mount()
