import store from '@/store'

export default {
	methods: {
		hasPerm(value) {
			const perms = store.getters.role.perms.map(p => p.perm_key)

			// console.log(value, perms, perms.includes(value))

			return perms.includes(value)
		},
		// 更新路由参数
		updateRouteQuery(query) {
		  this.$router.push({
		    query: Object.assign({}, this.$route.query, query)
		  })
		}
	}
}