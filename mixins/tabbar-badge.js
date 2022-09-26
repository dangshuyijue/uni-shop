import { mapGetters } from 'vuex'

// 导出一个mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  // 监听total 值的变化
  watch: {
    total() {
		// 调用 methods中的 setBadge 方法,重新为 tabBar 的数字徽章赋值
      this.setBadge()
    }
  },
  onShow() {
	  // 在页面展示的时候,设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
		// 调用setTabBarBadge（） 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
		  // 索引
        index: 2,
        text: this.total + ''  //  注意，text的值必须是字符串，不能是数字
      })
    }
  }
}
