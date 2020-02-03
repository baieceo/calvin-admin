import { fetchPermList } from '@/api/perm'
import { fetchRoleList, postRoleCreate, updateRole, removeRole } from '@/api/role'
import { mapGetters } from 'vuex'
import MixinsComponent from '@/mixins/component'

export default {
	mixins: [MixinsComponent],
	filters: {
	  statusFilter(status) {
	    const statusMap = {
	      published: 'success',
	      draft: 'gray',
	      deleted: 'danger'
	    }
	    return statusMap[status]
	  }
	},
	data() {
		return {
			action: '',
			canVisibleRoleDialog: false,
			postLoading: false,
			list: null,
			listLoading: true,
			// 分页配置
			filterLoading: false,
			// 筛选表单
			filterForm: [
			  {
			    name: 'accountId',
			    type: 'input',
			    label: '账户ID',
			    default: ''
			  }
			],
			permOptions: [],
			roleFormData: {
			  roleId: null,
			  roleName: null,
			  rolePerms: []
			},
			roleFormRules: {
			  roleName: [
			    { required: true, message: '角色名称不能为空' },
			    { max: 20, message: '角色名称最多20个字符' }
			  ],
			  rolePerms: [
			    { required: true, type: 'array', message: '角色权限不能为空' }
			  ]
			},
			roleFormTitle: '创建角色'
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ])
	},
	created() {
	  this.fetchEnum().then(this.fetchData)
	},
	methods: {
		fetchEnum() {
			const requestQueue = [
				fetchPermList({
					pageNum: 1,
					pageSize: 999
				})
			]

			return Promise.all(requestQueue).then(([permRes]) => {
				if (!permRes.code) {
					this.permOptions = permRes.data.list.map(item => ({ label: item.perm_name, value: item.perm_key, data: item }))
				}
			})
		},
		fetchData() {
			this.listLoading = true

			const permOptions = Array.from(this.permOptions)

			fetchRoleList().then(response => {
				this.list = response.data.list.map(item => {
					return {
						...item,
						permNames: item.role_perms.split(',').map(id => permOptions.find(o => o.data.id + '' === id + '').label)
					}
				})

				this.listLoading = false
			})
		},
		// 查询
		filterQuery() {
		  const params = {}

		  this.filterForm.forEach(item => (params[item.name] = item.value))

		  params.pageCurrent = 1
		  params.t = +new Date()

		  const error = this.filterValidate()

		  if (error.length) {
		    this.$message.error(error[0])
		  } else {
		    // 更新路由query
		    this.updateRouteQuery(params)
		  }
		},
		// 重置
		filterReset() {
		  this.pagination = Object.assign({}, defaultValue.pagination)

		  const params = {}

		  this.filterForm.forEach(item => (params[item.name] = item.value))

		  params.pageCurrent = 1

		  // 更新路由query
		  this.updateRouteQuery(params)
		},
		handleCreate() {
			this.canVisibleRoleDialog = true

			this.action = 'create'
			this.roleFormTitle = '创建角色'
			this.roleFormData.roleName = ''
			this.roleFormData.rolePerms = []
		},
		handleSave() {
			this.$refs['roleForm'].validate(valid => {
				if (valid) {
					if (this.action === 'create') {
						this.postCreateData()
					} else if (this.action === 'modify') {
						this.postUpdateData()
					} else if (this.action === 'view') {
						this.canVisibleRoleDialog = false
					}
				}
			})
		},
		handleModify(row) {
			this.canVisibleRoleDialog = true

			this.action = 'modify'
			this.roleFormTitle = `编辑角色 <${row.role_name}>`
			this.roleFormData.roleId = row.id
			this.roleFormData.roleName = row.role_name
			this.roleFormData.rolePerms = row.role_perms.split(',').map(i => Number(i))
		},
		handleView(row) {
			this.handleModify(row)

			this.action = 'view'
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该角色 <${row.role_name}>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeRole({
	          	roleId: row.id
	          }).then(res => {
	          	this.$message({
	          	  type: 'success',
	          	  message: '删除成功'
	          	})

	          	this.fetchData()
	          }).catch(_ => {
	          	this.$message.error('删除失败')
	          })
	          
	        }).catch(() => {         
	        })
		},
		postCreateData() {
			const params = {}

			params.roleName = this.roleFormData.roleName
			params.rolePerms = this.roleFormData.rolePerms.join(',')

			this.postLoading = true

			return postRoleCreate(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleRoleDialog = false

					this.$message.success('创建成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		postUpdateData() {
			const params = {}

			params.roleId = this.roleFormData.roleId
			params.roleName = this.roleFormData.roleName
			params.rolePerms = this.roleFormData.rolePerms.join(',')

			this.postLoading = true

			return updateRole(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleRoleDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('更新成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		}
	    
	},
	watch: {
		canVisibleRoleDialog(visible) {
			this.$nextTick(() => {
				this.$refs['roleForm'].clearValidate()
			})
		}
	}
}