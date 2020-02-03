import MixinsComponent from '@/mixins/component'
import { fetchAccountList, postAccountCreate, updateAccount, removeAccount, updatePassword } from '@/api/account'
import { fetchRoleList, fetchRoleInfo } from '@/api/role'
import { fetchPermList } from '@/api/perm'
import { mapGetters } from 'vuex'
import { hasPerm } from '@/permission'

const defaultValue = {
	pagination: {
		page: 1,
		size: 2,
		total: 0
	}
}

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
			roleOptions: [],
			permList: [],
			rolePrems: [],
			canVisiblePwdDialog: false,
			canVisibleAccountDialog: false,
			postLoading: false,
			list: null,
			listLoading: true,
			// 分页配置
			filterLoading: false,
			// 筛选表单
			filterForm: [
			    {
			        name: 'account_id',
			        type: 'input',
			        label: '账户ID',
			        default: ''
			    },
				{
				  name: 'account_role',
				  type: 'select',
				  label: '角色',
				  placeholder: '请选择',
				  clearable: true,
				  default: '',
				  value: '',
				  options: [],
				  remoteMethod() {
				    return new Promise(resolve => {
				      const params = {
				      	pageNum: 1,
				      	pageSize: 999
				      }

				      fetchRoleList(params).then(res => {
				        if (res.code === 0) {
				          const data = res.data.list.map(item => ({
				            label: item.role_name,
				            value: item.id
				          }))

				          resolve(data)
				        }
				      })
				    })
				  }
				}
			],
			accountFormData: {
			  id: null,
			  accountId: null,
			  accountPwd: null,
			  accountPwdOld: null,
			  accountPwdConfirm: null,
			  accountAvatar: null,
			  accountRoleId: null,
			  accountPerms: []
			},
			accountFormRules: {
			  accountId: [
			    { required: true, message: '账户ID不能为空' },
			    { max: 20, message: '账户ID最多20个字符' }
			  ],
			  accountPwd: [
			    { required: true, message: '账户密码不能为空' },
			    { min: 8, max: 20, message: '账户密码8-20个字符' }
			  ],
			  accountPwdOld: [
			    { required: true, message: '原始密码不能为空' },
			    { min: 8, max: 20, message: '账户密码8-20个字符' }
			  ],
			  accountPwdConfirm: [
			    { required: true, message: '确认密码不能为空' },
			    { min: 8, max: 20, message: '确认密码8-20个字符' },
			    { validator: this.vlidatePwdComfirm }
			  ],
			  accountAvatar: [
			    { required: true, message: '账户头像不能为空' }
			  ],
			  accountRoleId: [
			    { required: true, message: '账户角色不能为空' }
			  ],
			  accountPerms: [
			    { required: true, type: 'array', message: '权限不能为空' }
			  ]
			},
			accountFormTitle: '创建角色',
			pagination: Object.assign({}, defaultValue.pagination)
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ]),
	  permOptions() {
	  	const { permList, rolePrems } = this

	  	return permList.filter(p => rolePrems.includes(p.id + ''))
	  }
	},
	created() {
	  this.fetchOptions()
	  this.fetchData()
	},
	methods: {
		fetchOptions() {
			const queue = [
				fetchRoleList(),
				fetchPermList({
					pageNum: 1,
					pageSize: 999
				})
			]

			Promise.all(queue).then(([roleRes, permRes]) => {
				if (!roleRes.code) {
					this.roleOptions = roleRes.data.list
				}

				if (!permRes.code) {
					this.permList = permRes.data.list
				}
			})
		},
		fetchData() {

		  let params = Object.assign({}, this.$route.query)

		  this.listLoading = true

		  fetchAccountList(params).then(response => {
		    this.list = response.data.list
		    this.pagination = response.data.pagination
		    
		    this.listLoading = false
		  })
		},
		fetchRoleInfo(roleId) {
			if (!roleId) {
			  return false
			} else {
			    return fetchRoleInfo({ roleId }).then(res => {
				    if (!res.code) {
					    this.rolePrems = res.data.role_perms.split(',')
				    }
			    })
			}
		},
		filterValidate() {
			return []
		},
		// 查询
		filterQuery() {
		  const params = {}

  		  this.filterForm.forEach(item => (params[item.name] = item.value))

  		  this.pagination.page = 1

  		  params.t = +new Date()
  		  params.pageNum = this.pagination.page
  		  params.pageSize = this.pagination.size

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

  		  params.pageNum = this.pagination.page
  		  params.pageSize = this.pagination.size

  		  // 更新路由query
  		  this.updateRouteQuery(params)
		},
		handlePageChange(value) {
			this.pagination.page = Number(value)

			this.updateRouteQuery({
			  pageNum: Number(value)
			})
		},
		handleCreate() {
			this.canVisibleAccountDialog = true

			this.action = 'create'
			this.accountFormTitle = '创建账户'
			this.accountFormData.accountId = null
			this.accountFormData.accountPwd = null
			this.accountFormData.accountAvatar = null
			this.accountFormData.accountRoleId = null
			this.accountFormData.accountPerms = []
		},
		handleChangePwd(row) {
			this.canVisiblePwdDialog = true

			this.accountFormData.id = row.id
			this.accountFormData.accountId = row.account_id
			this.accountFormData.accountPwd = null
			this.accountFormData.accountPwdOld = null
			this.accountFormData.accountPwdConfirm = null
		},
		handleSave() {
			this.$refs['accountForm'].validate(valid => {
				if (valid) {
					if (this.action === 'create') {
						this.postCreateData()
					} else if (this.action === 'modify') {
						this.postUpdateData()
					} else if (this.action === 'view') {
						this.canVisibleAccountDialog = false
					}
				}
			})
		},
		handlePwdSave() {
			this.$refs['pwdForm'].validate(valid => {
				if (valid) {
					this.updatePassword()
				}
			})
		},
		handleModify(row) {
			this.canVisibleAccountDialog = true

			this.action = 'modify'
			this.accountFormTitle = `编辑账户 <${row.account_id}>`
			this.accountFormData.id = row.id
			this.accountFormData.accountId = row.account_id
			this.accountFormData.accountPwd = row.account_pwd
			this.accountFormData.accountAvatar = row.account_avatar
			this.accountFormData.accountRoleId = row.account_role
			this.accountFormData.accountPerms = row.account_perms.split(',').map(i => Number(i))
		},
		handleView(row) {
			this.handleModify(row)

			this.action = 'view'
			this.accountFormTitle = `查看账户 <${row.account_id}>`
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该 <${row.account_id}> 账户, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeAccount({
	          	id: row.id
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

			params.accountId = this.accountFormData.accountId
			params.accountPwd = this.accountFormData.accountPwd
			params.accountAvatar = this.accountFormData.accountAvatar
			params.accountRoleId = this.accountFormData.accountRoleId
			params.accountPerms = this.accountFormData.accountPerms.join(',')

			this.postLoading = true

			return postAccountCreate(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleAccountDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('保存成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},

		postUpdateData() {
			const params = {}

			params.id = this.accountFormData.id
			params.accountId = this.accountFormData.accountId
			params.accountPwd = this.accountFormData.accountPwd
			params.accountAvatar = this.accountFormData.accountAvatar
			params.accountRoleId = this.accountFormData.accountRoleId
			params.accountPerms = this.accountFormData.accountPerms.join(',')

			this.postLoading = true

			return updateAccount(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleAccountDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('更新成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		updatePassword() {
			const params = {}

			params.id = this.accountFormData.id
			params.accountPwd = this.accountFormData.accountPwd
			params.accountPwdOld = this.accountFormData.accountPwdOld

			this.postLoading = true

			return updatePassword(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisiblePwdDialog = false

					this.$message.success('更新密码成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		vlidatePwdComfirm(rule, value, callback) {
			if (value !== this.accountFormData.accountPwd) {
				callback('密码不一致')
			} else {
				callback()
			}
		}
	    
	},
	watch: {
		canVisibleAccountDialog(visible) {
			this.$nextTick(() => {
				this.$refs['accountForm'].clearValidate()
			})
		},
		canVisiblePwdDialog() {
			this.$nextTick(() => {
				this.$refs['pwdForm'].clearValidate()
			})
		},
		'accountFormData.accountRoleId': 'fetchRoleInfo',
		'$route.query': {
			handler: 'fetchData',
			immediate: true
		}
	}
}