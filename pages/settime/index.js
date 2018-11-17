//index.js
//获取应用实例
const app = getApp();
const domain = "https://jogiter.ap-northeast-1.elasticbeanstalk.com";

Page({
  data: {
    time: "请选择时间",
    date: "请选择日期",
    hasTime: false,
    hasDate: false,
    start_date: {},
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    reportSubmit: true,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
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
  },

  onLoad: function() {
    var dd = new Date();
    dd.setDate(dd.getDate() + 1);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    var date = y + "-" + m + "-" + d;
    console.log(date);

    this.setData({
      start_date: date
    });
  },

  formSubmit: function(e) {
    const domain = "https://jogiter.ap-northeast-1.elasticbeanstalk.com";

    //用户登陆获取openid
    function getOpenid(cb) {
      wx.login({
        success: function(res) {
          let code = res.code;
          console.log(`code=>${code}`);
          if (code) {
            //发起网络请求
            wx.request({
              url: `${domain}/wx/openid?code=${code}`,
              success: function({ data }) {
                let openid = data.data.openid;
                console.log(`openid=>${openid}`);
                //存入本地
                wx.setStorage({
                  key: "openid",
                  data: openid,
                  success: function() {
                    console.log("openid已经存到本地");
                  }
                });
                cb(null, openid);
              }
            });
          } else {
            console.log("登录失败！" + res.errMsg);
            cb(res.errMsg);
          }
        }
      });
    }

    //判断日期和时间是否都选择了
    if (!this.data.hasDate) {
      wx.showModal({
        title: "请选择开始日期",
        content: "请选择闹钟的开始日期",
        showCancel: false,
        confirmText: "好的"
      });
    } else if (!this.data.hasTime) {
      wx.showModal({
        title: "请选择闹钟时间",
        content: "请选择闹钟的推送提醒时间",
        showCancel: false,
        confirmText: "好的"
      });
    } else {
      console.log("选择完成");
      //提交订单到后台
      let formId = e.detail.formId;
      let days = e.detail.target.dataset.day;
      console.log(
        formId,
        days,
        app.globalData.openid,
        this.data.date,
        this.data.time
      );
      getOpenid((err, openid) => {
        if (err) {
          console.log(err);
          return;
        }
        wx.request({
          url: `${domain}/setclock`,
          method: "POST",
          data: {
            uid: openid,
            start_date: this.data.date,
            push_days: days,
            push_time: this.data.time,
            template_id: formId
          },
          success: function() {
            //回到首页
            wx.redirectTo({
              url: "../index/index"
            });
            console.log("传输完成");
          }
        });
      });
    }
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
