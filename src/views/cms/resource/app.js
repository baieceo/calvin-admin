import lodash from 'lodash'
import { postUpload } from '@/api/common'
import { fetchResourceList, fetchFolderExist, postFolderCreate, removeResource, postResourceRename } from '@/api/resource'
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
			canVisibleUploadDialog: false,
			canVisibleRenameDialog: false,
			canVisibleAddFolderDialog: false,
			dialogVisible: false,
			dialogImageUrl: '',
			postLoading: false,
			list: [],
			navs: [{
				name: '/',
				label: 'root'
			}],
			path: '/',
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
			folderFormData: {
				name: '',
				oldName: ''
			},
			folderFormRules: {
				name: [
				    { required: true, message: '文件夹名称不能为空', trigger: 'blur' },
				    { required: true, validator: this.validateNameExist, trigger: 'blur' }
				]
			},
			renameFormData: {
				name: ''
			},
			renameFormRules: {
				name: [
				    { required: true, message: '名称不能为空', trigger: 'blur' },
				    { required: true, validator: this.validateNameExist, trigger: 'blur' }
				]
			},
			uploadFormData: {
				file: [],
				name: '',
				path: ''
			},
			uploadFormRules: {
				file: [
				    { required: true, type: 'array', message: '文件不能为空', trigger: 'blur' }
				]
			},
		}
	},
	computed: {
	  ...mapGetters([
	    'name',
	    'role'
	  ])
	},
	created() {
	  this.fetchData()
	},
	methods: {
		fetchData() {
			this.listLoading = true

			const params = {}

			params.path = encodeURIComponent(this.path)

			fetchResourceList(params).then(response => {
				const mime = ['.jpg', '.png', '.bmp']

				response.data = response.data.map(item => {
					if (item.extname && mime.includes(item.extname.toLowerCase())) {
						item.isImage = true
					} else if (item.extname) {
						item.isFile = true
					} else if (item.type === 'directory') {
						item.isDirectory = true
					} else {
						item.isFile = true
					}

					return item
				})

				response.data = lodash.orderBy(response.data, ['type', 'name'], ['asc', 'asc'])

				this.list = response.data

				this.listLoading = false
			})
		},
		postFolderCreate() {
			const params = {}

			params.path = this.navs.map(i => i.name).join('/')
			params.name = this.folderFormData.name

			this.postLoading = true

			return postFolderCreate(params).then(res => {
				this.postLoading = false

				if (!res.code) {
					this.fetchData()

					this.canVisibleAddFolderDialog = false

					this.$message.success('创建成功')
				}
			}).catch(_ => {
				this.postLoading = false
			})
		},
		handleRemove(row) {
			const type = row.type === 'directory' ? '文件夹' : '文件'
			const path = this.navs.map(i => i.name).join('/')
			const name = row.name

			this.$confirm(`此操作将永久删除该${type} <${ row.name }>, 是否继续?`, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          removeResource({
	          	path,
	          	name
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
		handleRename(row) {

		},
	    handleDirectory(item) {
	    	this.path = item.path

	    	this.navs.push(item)
	    },
	    handleNavClick(item) {
	    	const navs = this.navs.slice()
	    	const index = navs.indexOf(item)
	    	const paths = navs.slice(0, index + 1)

	    	this.navs = navs.slice(0, index + 1)

	    	this.path = paths.map(i => i.name).join('/')
	    },
		handleAddFolder() {
			this.$refs['folderForm'].validate(valid => {
				if (valid) {
					this.postFolderCreate()
				}
			})
		},
		handleRename(item) {
			this.canVisibleRenameDialog = true

			this.renameFormData.name = item.name
			this.renameFormData.oldName = item.name
		},
		handleRenameSubmit() {
			this.$refs['renameForm'].validate(valid => {
				if (valid) {
					this.postResourceRename()
				}
			})
		},
		postResourceRename() {
			const params = {}

			params.path = this.navs.map(i => i.name).join('/'),
			params.name = this.renameFormData.name
			params.oldName = this.renameFormData.oldName

			this.postLoading = true

			return postResourceRename(params).then(res => {
				this.postLoading = false

				this.renameFormData.name = ''

				this.canVisibleRenameDialog = false

				this.$message.success('重命名成功')

				this.fetchData()
			}).catch(_ => {
				this.postLoading = false
			})
		},
		handleUploadFile() {
			const params = new FormData()

			params.append('file', this.uploadFormData.file[0])
			params.append('path', this.navs.map(i => i.name).join('/'))
			params.append('name', this.uploadFormData.name)

			this.postLoading = true

			return postUpload(params).then(res => {
				this.postLoading = false
				this.canVisibleUploadDialog = false

				this.uploadFormData.file = []
				this.uploadFormData.name = []

				this.fetchData()

				this.$message.success('上传成功')
			}).catch(_ => {
				this.postLoading = false
			})
		},
		handlePicturePreview(item) {
			this.dialogVisible = true
			this.dialogImageUrl = item.url
		},
		uploadFileHttpRequest(event) {
			this.uploadFormData.file = [ event.file ]
			this.uploadFormData.name = event.file.name
		},
		validateNameExist(rule, value, callback) {
			fetchFolderExist({
				name: value,
				path: this.navs.map(i => i.name).join('/')
			}).then(res => {
				if (res.data) {
					callback('文件夹已存在')
				} else {
					callback()
				}
			}).catch(_ => {
				console.log(_)

				callback('验证文件夹是否存在失败')
			})
		}
	    
	},
	watch: {
		canVisibleAddFolderDialog(visible) {
			this.$nextTick(() => {
				this.$refs['folderForm'].clearValidate()
			})
		},
		path: 'fetchData'
	}
}