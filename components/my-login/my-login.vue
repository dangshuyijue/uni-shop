<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
	// 1. 按需导入 mapMutations ，mapState辅助函数
  import { mapMutations, mapState } from 'vuex'

  export default {
    data() {
      return {

      };
    },
    computed: {
		// 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
		// 2. 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 用户授权之后，获取用户的基本信息,获取微信用户的基本信息
      getUserInfo(e) {
        console.log(e)
		// 判断是否获取用户信息成功
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
		// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        // console.log(e.detail.userInfo)
		// 3. 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo)
		
        this.getToken(e.detail)
      },
	  // 调用登录接口，换取永久的 token
      async getToken(info) {
         // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
		// 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

        // 准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
		 // 换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')

        // 直接把 token 保存到 vuex 中，就是更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
		// 判断 vuex 中的 redirectInfo 是否为 null
		// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
	  // 返回登录之前的页面
      navigateBack() {
		  // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
			// 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
			  // 要导航到的页面地址
            url: this.redirectInfo.from,
			// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
