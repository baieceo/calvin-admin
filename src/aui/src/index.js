import Filter from '../packages/filter/index.js'
import FilterTable from '../packages/filter-table/index.js'
import Result from '../packages/result/index.js'
import Descriptions from '../packages/descriptions/index.js'
import DescriptionsItem from '../packages/descriptions-item/index.js'

const components = [Filter, FilterTable, Result, Descriptions, DescriptionsItem]

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.0.1',
  install,
  Filter,
  FilterTable,
  Result,
  Descriptions,
  DescriptionsItem
}
