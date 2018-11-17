//app.js
App({
  onLaunch: function() {
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },

  globalData: {
    userInfo: null
  },

  //把用户信息传给后台建立用户数据
  register: function() {
    var _this = this;
    if (_this.globalData.openid && _this.globalData.userInfo) {
      wx.request({
        url: "己方服务器",
        data: {
          openid: _this.globalData.openid,
          nickName: _this.globalData.userInfo.nickName,
          avatarUrl: _this.globalData.userInfo.avatarUrl,
          gender: _this.globalData.userInfo.gender,
          province: _this.globalData.userInfo.province,
          city: _this.globalData.userInfo.city
        },
        success: function(res) {
          console.log("传值成功");
        }
      });
    }
  }
});
