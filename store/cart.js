export default {
	// 为当前模块开启命名空间
	namespaced: true,
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		// 读取本地所存储的数据,没有则空数组字符串
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	// 模块的mutations方法
	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

		 if (!findResult) {
				// 如果购物车中没有这件商品,则直接push
				state.cart.push(goods)
			} else {
				// 如果购物车中有这件商品,则只更新数量即可
			}
			// 通过commit方法,调用m_cart 命名空间下的saveToStorage方法
			this.commit('m_cart/saveToStorage')
		},
		// 持久化购物车中的商品存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新商品的数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据 Id 删除对应的商品
		removeGoodsById(state, goods_id) {
			// 调用数组的filter方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的更新状态
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},

	// 模块的getters属性
	getters: {
		// 购物车中所有商品的总数量
		total(state) {
			// let c = 0
			// state.cart.forEach(x => c += x.goods_count)
			// return c
			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		// 购物车中已勾选商品的总数量
		checkedCount(state) {
			// 先使用filter 方法,从购物车中过滤器已勾选的商品
			// 再使用reduce 方法,将已勾选的商品总数量进行累加
			// reduce() 的返回值就是已勾选的商品的总数量
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 已勾选商品的总价格
		checkedGoodsAmount(state) {
			// 先使用filter 方法,从购物车中过滤器已勾选的商品
			// 再使用reduce 方法,将已勾选的商品数量进 * 单价之后，进行累加
			// reduce() 的返回值就是已勾选的商品的总价、
			// 最后调用 toFixed(2) 方法, 保留两位小数
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item
				.goods_price, 0).toFixed(2)
		}
	}
}
