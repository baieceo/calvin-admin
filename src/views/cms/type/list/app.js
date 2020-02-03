import MixinsComponent from '@/mixins/component'
import { fetchTypeList, removeType } from '@/api/type'
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
			canVisibleMessageDialog: false,
			postLoading: false,
			list: null,
			listLoading: true,
			// 分页配置
			filterLoading: false,
			// 筛选表单
			filterForm: [
			  {
			    name: 'id',
			    type: 'input',
			    label: '分类ID',
			    default: ''
			  },
			  {
			    name: 'path',
			    type: 'input',
			    label: '分类目录',
			    default: ''
			  },
			  {
			    name: 'name',
			    type: 'input',
			    label: '分类名称',
			    default: ''
			  }
			],
			messageFormData: {
			  id: null
			},
			messageFormRules: {
			  status: [
			    { required: true, message: '状态不能为空', trigger: 'change' }
			  ],
			  remarks: [
			    { required: true, message: '备注不能为空', trigger: 'blur' },
			    { max: 50, message: '备注最多50个字符', trigger: 'blur' }
			  ]
			},
			messageFormTitle: '编辑留言',
			messageLoading: false,
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

		  fetchTypeList(params).then(response => {
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
			this.$router.push({
				name: 'CmsTypeCreate'
			})
		},
		handleModify(row) {
			this.$router.push({
				name: 'CmsTypeModify',
				params: {
					id: row.id
				}
			})
		},
		handleView(row) {
			this.$router.push({
				name: 'CmsTypeViewer',
				params: {
					id: row.id
				}
			})
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该分类 <${row.id}: ${row.name}>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeType({
	          	id: row.id
	          }).then(res => {
	          	this.$message({
	          	  type: 'success',
	          	  message: '删除成功'
	          	})

	          	this.fetchData()
	          }).catch(_ => {
	          	this.$message.error(_.message || '删除失败')
	          })
	          
	        }).catch(() => {        
	        })
		}
	    
	},
	watch: {
		canVisibleMessageDialog(visible) {
			this.$nextTick(() => {
				this.$refs['messageForm'].clearValidate()
			})
		},
		'$route.query': {
			handler: 'fetchData',
			immediate: true
		}
	}
}