import store from '@/store'

export default (Vue) => {
  Vue.directive('perm', {
    inserted(el, binding) {
      const perms = store.getters.role.perms
      const { value } = binding

      if (el.parentNode) {
        if (perms.findIndex(p => p.perm_key === value) === -1) {
          el.parentNode.removeChild(el)
        }
      }
    }
  })
}