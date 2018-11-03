//app.js
App({
  onLaunch: function () {
    var _this = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    const domain = 'http://localhost:3000'

    function getOpenId(success = function() {}) {
      wx.login({
        success (res) {
          if (res.code) {
            _this.globalData.code = res.code
            //发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wx6f06cf8a9c394917',
                secret: 'SECRET',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    function getUserInfo(id, done) {
      return wx.request({
        url: `${domain}/user`,
        data: {
          id: id
        },
        success ({data}) {
          done && done(data)
        }
      })
    }

    // 登录
    getOpenId(res => {
      // 获取 openid，支付 以及添加订阅记录
      _this.globalData.openid = res.data

      if (this.openIdReadyCallback) {
        this.openIdReadyCallback(res)
      }
      getUserInfo(res.id || '1111', ({ data }) => {
        _this.globalData.server = data

        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      })
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    server: null
  }
})
