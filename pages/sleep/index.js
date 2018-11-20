//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasMusic: false,
    msgid: {},
    avatar: "http://img.jogiter.cn/lm.jpg",
    nickname: "鲁鲁修的位",
    title: "标题",
    desc:
      "当浪漫褪色、浓情渐淡，柴米油盐的温暖何尝不是最长情的告白？ \
     有玫瑰，有表白。但爱情，要承诺，更需坚守 请珍惜那个来了之后就再也没走的人。 \
     愿年迈蹒跚，阳光和你仍在。 \
     今晚，想想能一直伴在你身边的人和事物，于是便是最幸福的了。好好睡觉吧小可爱 ​​​​",
    image: "http://img.jogiter.cn/bg.jpg",

    audio: {
      poster: "",
      name: "",
      author: "",
      src: ""
    },

    hasUserInfo: false,
    hasSetClock: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },

  onLoad: function(option) {
    this.setData({
      msgid: option.id
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }

    //get页面所需要的参数
    wx.request({
      url: "https://serverssl.szdazizai.com/msg",
      data: {
        id: this.data.msgid || 1
      },
      success: res => {
        let data = res.data.data;
        this.setData({
          avatar: data.avatar,
          nickname: data.nickname,
          title: data.title,
          desc: data.desc,
          image: data.image
        });
        console.log(this.data.msgid);
      }
    });
  },

  onShareAppMessage: function(e) {
    return {
      title: "今天睡了么，让我来哄你睡吧~",
      path: "/pages/sleep/index?id=" + this.data.msgid,
    };
  },

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
});
