//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    time: '请选择时间',
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },
  //事件处理函数
  timeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  payPush7: function () {
    this.pay(7)
  },
  payPush30: function () {
    this.pay(30)
  },
  pay: function (days) {
    console.log(days);
    setTimeout(function () {
      wx.navigateTo({
        url: "../sleep/index"
      });
    }, 1000);
  }
});
