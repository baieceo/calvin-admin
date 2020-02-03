import MixinsComponent from '@/mixins/component'
import { fetchPermList, postPermCreate, updatePerm, removePerm } from '@/api/perm'
import { mapGetters } from 'vuex'

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
			canVisiblePermDialog: false,
			postLoading: false,
			list: null,
			listLoading: true,
			// 分页配置
			filterLoading: false,
			// 筛选表单
			filterForm: [
			  {
			    name: 'permId',
			    type: 'input',
			    label: '权限ID',
			    default: ''
			  },
			  {
			    name: 'permKey',
			    type: 'input',
			    label: '权限KEY',
			    default: ''
			  },
			  {
			    name: 'permName',
			    type: 'input',
			    label: '权限名称',
			    default: ''
			  }
			],
			permFormData: {
			  permId: null,
			  permKey: null,
			  permName: null
			},
			permFormRules: {
			  permKey: [
			    { required: true, message: '权限KEY不能为空' },
			    { max: 50, message: '权限KEY最多50个字符' }
			  ],
			  permName: [
			    { required: true, message: '权限名称不能为空' },
			    { max: 50, message: '权限名称最多50个字符' }
			  ]
			},
			permFormTitle: '创建权限',
			pagination: Object.assign({}, defaultValue.pagination)
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ])
	},
	methods: {
		fetchData() {
		  let params = Object.assign({}, this.$route.query)

		  this.listLoading = true

		  fetchPermList(params).then(response => {
		    this.list = response.data.list
		    this.pagination = response.data.pagination

		    this.listLoading = false
		  })
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
			this.canVisiblePermDialog = true

			this.action = 'create'
			this.permFormTitle = '创建权限'
			this.permFormData.permKey = null
			this.permFormData.permName = null
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
			  .then(_ => {
			    done();
			  })
			  .catch(_ => {});
		},
		handleSave() {
			this.$refs['permForm'].validate(valid => {
				if (valid) {
					if (this.action === 'create') {
						this.postCreateData()
					} else if (this.action === 'modify') {
						this.postUpdateData()
					}
				}
			})
		},
		handleModify(row) {
			this.canVisiblePermDialog = true

			this.action = 'modify'
			this.permFormTitle = `编辑权限 <${row.perm_key}: ${row.perm_name}>`
			this.permFormData.permId = row.id
			this.permFormData.permKey = row.perm_key
			this.permFormData.permName = row.perm_name
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该权限 <${row.perm_key}: ${row.perm_name}>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removePerm({
	          	permId: row.id
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

			params.permKey = this.permFormData.permKey
			params.permName = this.permFormData.permName

			this.postLoading = true

			return postPermCreate(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisiblePermDialog = false

					this.$message.success('创建成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		postUpdateData() {
			const params = {}

			params.permId = this.permFormData.permId
			params.permKey = this.permFormData.permKey
			params.permName = this.permFormData.permName

			this.postLoading = true

			return updatePerm(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisiblePermDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('更新成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		}
	    
	},
	watch: {
		canVisiblePermDialog(visible) {
			this.$nextTick(() => {
				this.$refs['permForm'].clearValidate()
			})
		},
		'$route.query': {
			handler: 'fetchData',
			immediate: true
		}
	}
}