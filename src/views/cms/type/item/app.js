import MixinsComponent from '@/mixins/component'
import { fetchCommonEnums } from '@/api/common'
import { fetchType, updateType, fetchPathExist, postTypeCreate } from '@/api/type'
import { mapGetters } from 'vuex'

export default {
	mixins: [MixinsComponent],
	data() {
		return {
			loading: false,
			saveLoading: false,
			formData: {
				id: null,
				path: '',
				name: '',
				props: [],
				create_time: null,
				create_account_name: null,
				editor_time: null,
				editor_account_name: null
			},
			formRules: {
				path: [
					{ required: true, message: '请输入分类KEY', trigger: 'blur' },
					{ required: true, validator: this.validatePath, trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				],
				props: [
					{ required: true, message: '属性列表不能为空' }
				]
			},
			typeOptions: []
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ]),
	  action() {
	  	const map = {
	  		CmsTypeCreate: 'create',
	  		CmsTypeModify: 'modify',
	  		CmsTypeViewer: 'viewer'
	  	}

	  	return map[this.$route.name]
	  },
	  actionName() {
	  	const map = { 
	  		create: '新建', 
	  		modify: '编辑',
	  		viewer: '查看' 
	  	}

	  	return map[this.action]
	  }
	},
	created() {
		this.fetchEnums()

		if (this.action === 'modify' || this.action === 'viewer') {
			this.fetchData()	
		}
	},
	methods: {
		fetchData() {
		  let params = {}

		  params.id = this.$route.params.id

		  this.loading = true

		  fetchType(params).then(res => {
		    this.loading = false

		    res.data.props = res.data.props.map(i => ({
		    	...i,
		    	__exist: true
		    }))

		    this.formData = res.data
		  }).catch(_ => {
		  	this.loading = false

		  	this.$message.error('获取分类失败')
		  })
		},
		fetchEnums() {
			const queue = [
				fetchCommonEnums({
					key: 'type'
				})
			]

			return Promise.all(queue).then(([typeRes]) => {
				this.typeOptions = typeRes.data

				return Promise.resolve()
			}).catch(_ => { return Promise.reject() })
		},
		update() {
			this.saveLoading = true

			this.formData.props = this.formData.props.map(n => {
				delete n.__exist

				return n
			})

			const params = Object.assign({}, this.formData)

			updateType(params).then(res => {
				this.saveLoading = false

				this.$message.success(this.actionName + '分类成功')

				this.fetchData()
			}).catch(_ => {
				this.saveLoading = false

				this.$message.error(this.actionName + '分类失败')
			})
		},
		postData() {
			this.saveLoading = true

			const params = Object.assign({}, this.formData)

			postTypeCreate(params).then(res => {
				this.saveLoading = false

				this.$message.success(this.actionName + '分类成功')

				this.$router.push({
					name: 'CmsTypeModify',
					params: {
						id: res.data
					}
				})
			}).catch(_ => {
				this.saveLoading = false

				this.$message.error(this.actionName + '分类失败')
			})
		},
		handleBack() {
			this.$router.go(-1)
		},

		handleSaveForm(formName) {
			this.$refs['typeForm'].validate(valid => {
				if (valid) {
					if (this.action === 'create') {
						this.postData()
					} else if (this.action === 'modify') {
						this.update()
					}
				} else {
					return false
				}
			})
		},
		handleAddProp() {
			this.formData.props.push({
				key: '',
				type: null,
				label: ''
			})
		},
		handleRemoveProp(item) {
			this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const index = this.formData.props.indexOf(item)

				if (index !== -1) {
					this.formData.props.splice(index, 1)
				}

				this.$message({
					type: 'success',
					message: '删除成功!'
				})
			}).catch(_ => {})
		},
		validatePropKey(rule, value, callback) {
			if (this.formData.props.filter(i => i.key === value).length > 1) {
				callback('KEY重复')
			} else {
				callback()
			}
		},
		// 异步验证key目录是否存在
		async validatePath(rule, value, callback) {
			const res = await fetchPathExist({ path: value })
			const exist = res.data

			if (exist && this.action === 'create') {
				callback('此目录已存在')
			} else {
				callback()
			}
		}
	}
}