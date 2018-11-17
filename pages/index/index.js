//index.js
//获取应用实例
const app = getApp();
const domain = "https://jogiter.ap-northeast-1.elasticbeanstalk.com";

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    orderinfo: {},
    orderTxt: {}
  },

  // 事件处理函数
  // setClock: function() {
  //   wx.navigateTo({
  //     url: "../settime/index"
  //   });
  // },

  renew: function() {
    wx.redirectTo({
      url: "../settime/index"
    });
  },

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    wx.setStorage({
      key: "userInfo",
      data: e.detail.userInfo,
      success: function() {
        console.log(e.detail.userInfo);
      }
    });

    //如果用户有userinfo和openid，立即执行注册register
    if (this.data.hasUserInfo) {
      if (app.globalData.openid) {
        app.register();
      }
      wx.redirectTo({
        url: "../settime/index"
      });
    }
  },

  // getUserInfo: function(e) {
  //   console.log(e);
  //   app.globalData.userInfo = e.detail.userInfo;
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   });
  // },

  onLoad: function() {
    let _this = this;
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

    function getUser(openid, cb) {
      wx.request({
        url: `${domain}/user?id=${openid}`,
        success: function({ data }) {
          cb(null, data);
        }
      });
    }

    function getOrderText(userinfo) {
      let start = new Date(userinfo.start_date)
        .toLocaleDateString()
        .split("/")
        .join(".");
      let end = new Date(
        new Date(userinfo.start_date).getTime() +
          3600 * 1000 * 24 * userinfo.push_days
      )
        .toLocaleDateString()
        .split("/")
        .join(".");
      let txt = `${start}-${end} 每天 ${userinfo.push_time}`;
      return txt;
    }

    getOpenid((err, openid) => {
      if (err) {
        console.log(err);
        return;
      }
      getUser(openid, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        if (res.code === 0) {
          let data = res.data;
          console.log(data);

          _this.setData({
            hasSetClock: data.orderlist.length > 0,
            count: data.count,
            orderTxt: getOrderText(data.orderlist[0] || {})
          });
        }
      });
    });
  }
});
