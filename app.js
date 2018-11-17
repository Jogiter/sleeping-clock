//app.js
App({


  globalData: {
    openid: null,
    userInfo: null,
  },

  onLaunch: function() {
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);





    //用户登陆获取openid
    getOpenId();


    function getOpenId() {
      wx.login({
        success: function(res) {
          if (res.code) {
            console.log(res.code);
            //发起网络请求
            wx.request({
              url: 'http://alarm-env.ap-northeast-1.elasticbeanstalk.com/wx/openid',
              data: {
                code: res.code,

              },
              //success后，给我返回一个res数据包，里面是openid
              success: function(res) {
                console.log(res.data);


                if (res.data) {
                  _this.globalData.openid = res.data.data.openid,
                  console.log('openid赋值'+ res.data.data.openid);



                    //存入本地
                    wx.setStorage({
                      key: "openid",
                      data: res.data.data.openid,
                      success: function() {
                        console.log('openid已经存到本地');
                      }
                    })

                    if(_this.openidCallback){
                      _this.openidCallback(res)
                    }
                }
              },
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }

    //检查用户设定，如果用户已经授权可以直接获取userinfo信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;



              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              //存入本地
              wx.setStorage({

                key: "userInfo",
                data: res.userInfo,
                success: function() {
                  console.log('userInfo已经存到本地');
                }

              })



            }
          })
        }
      }
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


  //把用户信息传给后台建立用户数据
  register: function() {

    var _this = this
    if (_this.globalData.openid && _this.globalData.userInfo) {
      wx.request({
        url: "己方服务器",
        data: {
          openid: _this.globalData.openid,
          nickName: _this.globalData.userInfo.nickName,
          avatarUrl: _this.globalData.userInfo.avatarUrl,
          gender: _this.globalData.userInfo.gender,
          province: _this.globalData.userInfo.province,
          city: _this.globalData.userInfo.city,

        },
        success: function(res) {
          console.log("传值成功");
        }

      })
    }
  }
})
