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

  setOrderText: function(userinfo) {
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
    this.setData({
      orderTxt: txt
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

  onLoad: function() {
    //获取用户userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      wx.setStorage({
        key: "userInfo",
        data: app.globalData.userInfo,
        success: function() {
          console.log("已有用户信息" + app.globalData.userInfo);
        }
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo;

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo,
          success: function() {
            console.log("已有用户信息2" + res.userInfo);
          }
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          wx.setStorage({
            key: "userInfo",
            data: res.userInfo,
            success: function() {
              console.log("已有用户信息3" + res.userInfo);
            }
          });
        }
      });
    }

    //如果用户有userinfo和openid，立即执行注册register
    if (this.data.hasUserInfo) {
      if (app.globalData.openid) {
        app.register();
      }
    }

    //如果用户有openid,则请求orderlist数据，并执行得出orderTxt
    console.log(app.globalData);
    if (app.globalData.openid) {
      wx.request({
        url: `${domain}/user`,
        data: {
          id: app.globalData.openid
        },
        success: function(res) {
          console.log(res);
          if (res.data.orderlist.length > 0) {
            this.setData({
              orderinfo: res.data.orderlist
            });
          }

          if (this.data.orderinfo) {
            setOrderText(this.data.orderinfo);
            this.setData({
              hasSetClock: true
            });
          }
        }
      });
    }
  }
});
