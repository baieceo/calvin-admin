'use strict'

import emitter from '../../../src/mixins/emitter'

export default {
  name: 'AuiDescriptionsItem',
  componentName: 'AuiDescriptionsItem',
  mixins: [emitter],
  props: {
    // 内容的描述
    label: {
      type: String
    },
    // 包含列的数量
    span: {
      type: Number,
      default: 1
    },
    align: {
      type: String,
      default: 'left'
    }
  },
  mounted() {
    if (this.label) {
      this.dispatch('AuiDescriptions', 'aui.descriptions.addField', [this])
    }
  },
  beforeDestroy() {
    this.dispatch('AuiDescriptions', 'aui.descriptions.removeField', [this])
  }
}
