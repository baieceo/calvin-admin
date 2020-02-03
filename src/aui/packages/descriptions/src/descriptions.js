'use strict'

import DescriptionsTable from './descriptions-table'

export default {
  name: 'AuiDescriptions',
  componentName: 'AuiDescriptions',
  components: {
    DescriptionsTable
  },
  props: {
    // 描述列表的标题，显示在最顶部
    title: {
      type: String
    },
    // 一行的 DescriptionItems 数量
    column: {
      type: Number,
      default: 3
    },
    // 是否展示边框
    bordered: {
      type: Boolean
    },
    // 描述布局 horizontal | vertical
    layout: {
      type: String,
      default: 'horizontal'
    },
    // 设置列表的大小。可以设置为 middle 、small, 或不填（只有设置 bordered={true} 生效）
    // default | middle | small
    size: {
      type: String,
      default: 'default'
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: 'auto'
    },
    // 标签背景色
    labelColor: {
      type: String
    },
    // 内容宽度
    contentWidth: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      fields: []
    }
  },
  created() {
    this.$on('aui.descriptions.addField', field => {
      if (field) {
        this.fields.push(field)
      }
    })

    this.$on('aui.descriptions.removeField', field => {
      if (field.label) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },
  methods: {
    hasOwnSlot(name) {
      return this.$slots[name] !== undefined
    }
  }
}
