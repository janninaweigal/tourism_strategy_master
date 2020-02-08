import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	adminInfo: sessionStorage.getItem('adminInfo')?JSON.parse(sessionStorage.getItem('adminInfo')): 'images/default.png'
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		sessionStorage.setItem('adminInfo',JSON.stringify(adminInfo));
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async saveAdminInfo({commit},data){
		commit('saveAdminInfo',data);
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
