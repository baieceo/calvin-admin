import MixinsComponent from '@/mixins/component'
import { postPermCreate, updatePerm } from '@/api/perm'
import { fetchMessageList, fetchMessageInfo, removeMessage, updateMessage } from '@/api/message'
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
			    name: 'name',
			    type: 'input',
			    label: '姓名',
			    default: ''
			  },
			  {
			    name: 'email',
			    type: 'input',
			    label: '电子邮箱',
			    default: ''
			  },
			  {
			    name: 'mobile',
			    type: 'input',
			    label: '联络手机',
			    default: ''
			  },
			  {
			    name: 'wechat',
			    type: 'input',
			    label: '微信',
			    default: ''
			  },
			  {
			    name: 'grade',
			    type: 'input',
			    label: '年级',
			    default: ''
			  },
			  {
			    name: 'content',
			    type: 'input',
			    label: '留言',
			    default: ''
			  },
			  {
			    name: 'status',
			    type: 'select',
			    label: '状态',
			    options: [{ label: '未处理', value: '0' }, { label: '已处理', value: '1' }],
			    default: '',
			    clearable: true
			  },
			  {
			    name: 'create_timerange',
			    type: 'datetimerange',
			    label: '时间',
			    default: [],
			    clearable: true
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

		  fetchMessageList(params).then(response => {
		    this.list = response.data.list
		    this.pagination = response.data.pagination

		    this.listLoading = false
		  })
		},
		fetchMessageInfo() {
			const params = {}

			params.id = this.messageFormData.id

			this.messageLoading = true

			return fetchMessageInfo(params).then(res => {
				this.messageLoading = false

				if (!res.code) {
					this.messageFormData = res.data
				}
			}).catch(_ => {
				console.log(_)

				this.$message.error('获取消息详情失败')

				this.messageLoading = false
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
		handleSave() {
			if (this.action === 'view') {
				this.canVisibleMessageDialog = false

				return false
			}

			this.$refs['messageForm'].validate(valid => {
				if (valid) {
					if (this.action === 'modify') {
						this.postUpdateData()
					}
				}
			})
		},
		handleModify(row) {
			this.canVisibleMessageDialog = true

			this.action = 'modify'
			this.messageFormTitle = `编辑留言`
			this.messageFormData.id = row.id
		},
		handleView(row) {
			this.canVisibleMessageDialog = true

			this.action = 'view'
			this.messageFormTitle = `查看留言`
			this.messageFormData.id = row.id
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该留言 <${row.id}: ${row.name} ${row.mobile}>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeMessage({
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
		},
		postCreateData() {
			const params = {}

			params.permKey = this.messageFormData.permKey
			params.permName = this.messageFormData.permName

			this.postLoading = true

			return postPermCreate(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleMessageDialog = false

					this.$message.success('创建成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		postUpdateData() {
			const params = {}

			params.id = this.messageFormData.id
			params.status = this.messageFormData.status
			params.remarks = this.messageFormData.remarks

			this.postLoading = true

			return updateMessage(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleMessageDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('更新成功')
				}
			}).catch(_ => {
				this.postLoading = false
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
		},
		'messageFormData.id': 'fetchMessageInfo'
	}
}