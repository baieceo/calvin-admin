'use strict'

export default {
  name: 'AuiFilter',
  props: {
    value: {
      type: Array
    },
    labelWidth: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideReset: {
      type: Boolean,
      default: false
    },
    // 隐藏过滤字段
    hideFilter: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      filterLoading: this.loading
    }
  },
  computed: {
    filterFormModel() {
      const model = {}

      this.value.forEach(item => {
        if (item.remoteMethod && !item.options) {
          this.$set(item, 'options', [])
        }

        const value = item.value

        if (item.remoteMethod && !item.options.length) {
          if (!item.loading) {
            item.loading = true
            item.loadingText = item.loadingText || '加载中'
            item.disabled = true
            item.value = ''

            item
              .remoteMethod()
              .then(
                resolve => {
                  item.options = resolve

                  item.loading = false
                  item.disabled = false
                  item.value = value
                },
                reject => {
                  item.loading = false
                  item.disabled = false
                  item.value = value

                  console.log(reject)
                }
              )
              .catch(e => {
                item.loading = false
                item.disabled = false

                console.log(e)
              })
          }
        }

        model[item.name] = item
      })

      return model
    }
  },
  created() {
    this.updateValue(this.$route.query)
  },
  methods: {
    resetFilter() {
      this.$emit('reset')

      // this.filterTable()
    },
    filterTable() {
      this.$emit('submit', this.value)
    },
    updateValue(query) {
      this.value.forEach(item => {
        if (query[item.name] !== undefined) {
          this.$set(item, 'value', query[item.name])
        }
      })
    }
  },
  watch: {
    loading(newVal) {
      this.filterLoading = newVal
    },
    $route: {
      handler(newVal, oldVal) {
        this.updateValue(newVal.query)
      },
      deep: true,
      immediate: true
    }
  }
}
