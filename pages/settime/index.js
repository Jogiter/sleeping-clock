//index.js
//获取应用实例
const app = getApp();

var util = require("../../utils/util.js");
var domain = util.domain();

Page({
  data: {
    time: "请选择时间",
    date: "请选择日期",
    hasTime: false,
    hasDate: false,
    start_date: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    thirtysrc:
      "https://img.jogiter.cn/clock/325119a429f02d3841137b739b373434ff02decb",
    sevensrc:
      "https://img.jogiter.cn/clock/633052c5bc9da4342045deb32c98c2934c9f6f6f"
  },

  //时间处理函数
  dateChange: function(e) {
    this.setData({
      date: e.detail.value,
      hasDate: true
    });
  },

  //事件处理函数
  timeChange: function(e) {
    this.setData({
      time: e.detail.value,
      hasTime: true
    });
    console.log(this.data.time);
  },

  onLoad: function() {
    console.log(this.arrayData.tempid.length);
    var dd = new Date();
    dd.setDate(dd.getDate() + 1);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    var date = y + "-" + m + "-" + d;
    console.log(date);
    //获取明天的日期
    this.setData({
      start_date: date
    });
  },

  push: function(event) {
    //判断日期和时间是否都选择了
    console.log(event.detail);
    if (!this.data.hasTime) {
      wx.showModal({
        title: "请选择闹钟时间",
        content: "请选择闹钟的推送提醒时间",
        showCancel: false,
        confirmText: "好的"
      });
    } else {
      console.log("选择完成");
      //提交订单到后台
      console.log(event.detail.target.dataset.day);
      console.log(event.detail.formId);

      this.arrayData.tempid.push(event.detail.formId);

      console.log("数组长度" + this.arrayData.tempid.length);
      console.log(this.arrayData.tempid);
    }

    if (this.arrayData.tempid.length >= 6) {
      //请求post
      wx.request({
        url: `${domain}/setclock`,
        method: "POST",
        data: {
          uid: app.globalData.openid,
          start_date: this.data.start_date,
          push_days: 6,
          push_time: this.data.time,
          template_id: this.arrayData.tempid.join(",")
        },

        success: function() {
          //回到首页
          wx.redirectTo({
            url: "../index/index"
          });
          console.log("下单完成");
        }
      });
    }
  },

  arrayData: {
    tempid: []
  }
});

//支付暂时不做
// payPush7: function () {
//   this.pay(7)
// },
// payPush30: function () {
//   this.pay(30)
// },

//   pay: function (days) {
//     console.log(days);
//     setTimeout(function () {
//       wx.navigateTo({
//         url: "../sleep/index"
//       });
//     }, 1000);
//   }
// }
