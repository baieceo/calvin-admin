'use strict'

import FilterForm from '../../filter'
import request from '@/utils/request'

export default {
  name: 'AuiFilterTable',
  components: {
    FilterForm
  },
  props: {
    value: {
      type: Array
    },
    labelWidth: {
      type: String
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 请求地址
    action: {
      type: String,
      default: ''
    },
    // 请求头部
    headers: {
      type: Object
    },
    // 请求参数
    data: {
      type: [String, Object, Array]
    },
    // 请求参数
    method: {
      type: String,
      default: 'GET'
    },
    // 隐藏重置按钮
    hideReset: {
      type: Boolean,
      default: false
    },
    // 隐藏过滤字段
    hideFilter: {
      type: Array
    }
  },
  data() {
    return {
      filterLoading: this.loading
    }
  },
  methods: {
    filterFormChange() {
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },
    submit() {
      this.$emit('submit', this.value)

      if (this.action) {
        this.filterLoading = true

        request({
          method: this.method,
          data: this.data,
          url: this.action,
          headers: this.headers
        })
          .then(response => {
            if (response.status === 200) {
              this.$emit('success', response.data)
            } else {
              this.$emit('error', response.msg)
            }

            this.filterLoading = false
          })
          .catch(error => {
            this.filterLoading = false

            this.$emit('error', error)
          })
      }
    },
    // 重置表单
    resetFilter() {
      this.value.map(item => (item.value = item.default))

      this.$emit('reset')

      /* this.$nextTick(() => {
        this.submit()
      }) */
    }
  },
  watch: {
    loading(newVal) {
      this.filterLoading = newVal
    },
    value: {
      handler(newVal) {},
      deep: true
    }
  }
}
