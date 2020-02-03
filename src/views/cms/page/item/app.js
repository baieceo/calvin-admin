import MixinsComponent from '@/mixins/component'
import { fetchCommonEnums, postUpload } from '@/api/common'
import { fetchTypeList, fetchType, fetchPathExist, postTypeCreate } from '@/api/type'
import { postPageCreate, fetchPage, updatePage } from '@/api/page'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
	mixins: [MixinsComponent],
	data() {
		return {
			loading: false,
			saveLoading: false,
			formData: {
				id: null,
				url: null,
				title: null,
				type: null,
				props: [],
				create_time: null,
				create_account_name: null,
				editor_time: null,
				editor_account_name: null
			},
			formRules: {
				title: [
					{ required: true, message: '页面标题不能为空', trigger: 'change' }
				],
				type: [
					{ required: true, message: '所属分类不能为空', trigger: 'change' }
				]
			},
			typeOptions: [],
			typeListOptions: [],
			dialogImageUrl: '',
			dialogVisible: false
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ]),
	  action() {
	  	const map = {
	  		CmsPageCreate: 'create',
	  		CmsPageModify: 'modify',
	  		CmsPageViewer: 'viewer'
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
	  },
	  uploadHeaders() {
	  	return {
	  		token: this.$store.getters.token
	  	}
	  }
	},
	created() {
		this.fetchEnums().catch(_ => {})

		if (this.action === 'modify' || this.action === 'viewer') {
			this.fetchData().catch(_ => {})
		}
	},
	methods: {
		fetchData() {
		  let params = {}

		  params.id = this.$route.params.id

		  this.loading = true

		  return fetchPage(params).then(res => {
		    // this.loading = false

		    // this.formData = res.data

		    return Promise.resolve([res.data.type, res.data])
		  }).then(([typeId, pageRes]) => {
		  	return this.fetchType(typeId).then(typeRes => {
		  		const mergeProps = []

		  		typeRes.props.forEach((typeItem, index) => {
		  			const pageItem = pageRes.props.find(i => i.key === typeItem.key)

		  			if (pageItem) {
		  				mergeProps.push(pageItem)
		  			} else {
		  				mergeProps.push(typeItem)
		  			}
		  		})

		  		pageRes.props = mergeProps
		  		
		  		this.formData = pageRes

		  		this.loading = false
		  	})
		  }).catch(_ => {
		  	this.loading = false

		  	this.$message.error('获取分类失败')

		  	return Promise.reject()
		  })
		},
		fetchEnums() {
			const queue = [
				fetchTypeList({
					pageNum: 1,
					pageSize: 999
				})
			]

			return Promise.all(queue).then(([typeListRes]) => {
				this.typeListOptions = typeListRes.data.list.map(i => ({
					label: i.name,
					value: i.id
				}))

				this.typeOptions = typeRes.data

				return Promise.resolve()
			}).catch(_ => { return Promise.reject() })
		},
		fetchType(id) {
			return fetchType({
				id
			}).then(res => {
				res.data.props = res.data.props.map(i => {
					if (i.value === undefined) {
						i.value = null
					}

					// 文本或图片数组
					if ((i.type === 3 || i.type === 6) && !i.value) {
						i.value = []
					}

					return i
				})

				return Promise.resolve(res.data)
			}).catch(_ => {
				console.log(_)

				this.$message.error('获取分类失败')

				return Promise.reject()
			})
		},
		update() {
			this.saveLoading = true

			const params = Object.assign({}, this.formData)

			params.id = this.formData.id
			params.title = this.formData.title
			params.type = this.formData.type
			params.props = this.formData.props

			updatePage(params).then(res => {
				this.saveLoading = false

				this.$message.success(this.actionName + '页面成功')

				this.fetchData()
			}).catch(_ => {
				this.saveLoading = false

				this.$message.error(this.actionName + '页面失败')
			})
		},
		postData() {
			this.saveLoading = true

			const params = Object.assign({}, this.formData)

			params.title = this.formData.title
			params.type = this.formData.type
			params.props = this.formData.props

			postPageCreate(params).then(res => {
				this.saveLoading = false

				this.$message.success(this.actionName + '页面成功')

				this.$router.push({
					name: 'CmsPageModify',
					params: {
						id: res.data
					}
				})
			}).catch(_ => {
				this.saveLoading = false

				this.$message.error(this.actionName + '页面失败')
			})
		},
		handleBack() {
			this.$router.go(-1)
		},

		handleSaveForm(formName) {
			this.$refs['pageForm'].validate(valid => {
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
		handleAddItem(prop) {
			prop.value.push(null)
		},
		handleRemoveItem(prop, index) {
			const map = {
				3: '文本',
				6: '图片'
			}

			this.$confirm(`此操作将永久删除 ${map[prop.type]}${ index === undefined ? '' : index + 1}，是否继续?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (index === undefined) {
					prop.value = null
				} else {
					prop.value.splice(index, 1)
				}
				

				this.$message({
					type: 'success',
					message: '删除成功!'
				})
			}).catch(_ => {})
		},
		handleTypeChange(id) {
			this.fetchType(id).then(res => {
				this.formData.props = res.props
			})
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url
			this.dialogVisible = true
		},
		handlePictureError(err, file, fileList) {
			console.log(err, file, fileList)
		},
		handlePictureSuccess(response, file, fileList) {
			const path = response.data

			console.log(path, file, fileList)
		},
		handlePictureRequest(ev) {
			const file = ev.target.files[0]
			const action = ev.target.getAttribute('action')
			const key = action.split('&')[0]
			const index = action.split('&').length > 1 ? Number(action.split('&')[1]) : -1
			const formdata = new FormData()

			formdata.append('file', file)

			postUpload(formdata).then(res => {
				const target = this.formData.props.find(i => i.key === key)

				if (index !== -1) {
					this.$set(target.value, index, res.data)
				} else {
					this.$set(target, 'value', res.data)
				}
			}).catch(_ => {
				console.log(_)
			})
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