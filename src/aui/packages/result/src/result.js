'use strict'

export default {
  name: 'AuiResult',
  props: {
    // title 文字
    title: {
      type: String
    },
    // subTitle 文字
    subTitle: {
      type: String
    },
    // 结果的状态,决定图标和颜色 'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'
    status: {
      type: String,
      default: 'info'
    },
    // 自定义 icon
    icon: {
      type: String
    }
  },
  methods: {
    hasOwnSlot(name) {
      return this.$slots[name] !== undefined
    }
  }
}
