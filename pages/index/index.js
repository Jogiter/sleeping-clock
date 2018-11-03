//index.js
//获取应用实例
const app = getApp();
const domain = 'http://localhost:3000'

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    info: {}
  },
  //事件处理函数
  setClock: function() {
    wx.navigateTo({
      url: "../settime/index"
    });
  },
  renew: function () {
    wx.navigateTo({
      url: "../settime/index"
    });
  },
  setOrderText: function (userinfo) {
    let start = new Date(userinfo.start_date).toLocaleDateString().split('/').join('.')
    let end = new Date(new Date(userinfo.start_date).getTime() + 3600 * 1000 * 24 * userinfo.push_days).toLocaleDateString().split('/').join('.')
    let txt = `${start}-${end} 每天 ${userinfo.push_time}`
    this.setData({
      orderTxt: txt
    })
  },

  onLoad: function() {
    console.log(app.globalData);
  }
});
