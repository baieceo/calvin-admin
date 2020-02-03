import MixinsComponent from '@/mixins/component'
import { postPermCreate, updatePerm } from '@/api/perm'
import { fetchApplyList, fetchApplyInfo, removeApply, updateApply } from '@/api/apply'
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
			canVisibleApplyDialog: false,
			postLoading: false,
			list: null,
			listLoading: true,
			// 分页配置
			filterLoading: false,
			// 筛选表单
			filterForm: [
			  {
			    name: 'apply_id',
			    type: 'input',
			    label: '申请ID',
			    default: ''
			  },
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
			    label: '申请',
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
			applyFormData: {
			  id: null
			},
			applyFormRules: {
			  status: [
			    { required: true, message: '状态不能为空', trigger: 'change' }
			  ],
			  remarks: [
			    { required: true, message: '备注不能为空', trigger: 'blur' },
			    { max: 50, message: '备注最多50个字符', trigger: 'blur' }
			  ]
			},
			applyFormTitle: '编辑申请',
			applyLoading: false,
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

		  fetchApplyList(params).then(response => {
		    this.list = response.data.list
		    this.pagination = response.data.pagination

		    this.listLoading = false
		  })
		},
		fetchApplyInfo() {
			const params = {}

			params.id = this.applyFormData.id

			console.log(111111, params.id)

			this.applyLoading = true

			return fetchApplyInfo(params).then(res => {
				this.applyLoading = false

				if (!res.code) {
					this.applyFormData = res.data
				}
			}).catch(_ => {
				console.log(_)

				this.$message.error('获取消息详情失败')

				this.applyLoading = false
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
				this.canVisibleApplyDialog = false

				return false
			}

			this.$refs['applyForm'].validate(valid => {
				if (valid) {
					if (this.action === 'modify') {
						this.postUpdateData()
					}
				}
			})
		},
		handleModify(row) {
			this.canVisibleApplyDialog = true

			this.action = 'modify'
			this.applyFormTitle = `编辑申请`
			this.applyFormData.id = row.id

			console.log(22222, this.applyFormData.id)
		},
		handleView(row) {
			this.canVisibleApplyDialog = true

			this.action = 'view'
			this.applyFormTitle = `查看申请`
			this.applyFormData.id = row.id
		},
		handleRemove(row) {
			this.$confirm(`此操作将永久删除该申请 <${row.id}: ${row.name} ${row.mobile}>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeApply({
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
		postUpdateData() {
			const params = {}

			params.id = this.applyFormData.id
			params.status = this.applyFormData.status
			params.remarks = this.applyFormData.remarks

			this.postLoading = true

			return updateApply(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleApplyDialog = false

					this.$store.dispatch('user/getInfo')

					this.$message.success('更新成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		}
	    
	},
	watch: {
		canVisibleApplyDialog(visible) {
			this.$nextTick(() => {
				this.$refs['applyForm'].clearValidate()
			})
		},
		'$route.query': {
			handler: 'fetchData',
			immediate: true
		},
		'applyFormData.id': 'fetchApplyInfo'
	}
}