<template>
	<view>
		<!-- 渲染商品列表数据 -->
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '',
					cid: '',
					// 页数
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				// 节流阀
				isloading: false
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''

			this.getGoodsList()
		},
		methods: {
			// 获取商品列表数据的方法，发起请求
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isloading = false
				// 只要数据请求完毕,就立即按需调用cb回调函数
				cb && cb()
				
				// 如果请求失败,则retrun出去,并调用数据请求失败的封装弹框方法
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值，通过展开运算符的形式，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 点击事件,跳转到应用内的某个页面
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		// 监听页面的上拉触底行为
		onReachBottom() {
			// 当前的页码 * 每页显示多少条数据 >= 总条数
			// pagenum * pagesize >= total
			// 判断是否还有下一页数据 >= 总条数，就证明没有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
			// 判断是否正在请求其它数据，如果是,则不发起额外的请求
			if (this.isloading) return

			// 让页码值自增+1
			this.queryObj.pagenum++
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新的事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []

			// 重新发起数据请求，请求完成后关闭当前页面的下拉刷新效果
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">
	
</style>
