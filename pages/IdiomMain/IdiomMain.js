// pages/IdiomMain/IdiomMain.js
Page({
  data: {
    nowScore:null,
    maxScore:null,
  },
  onLoad: function (options) {
    this.setData({
      nowScore:options.nowScore || "开始",
      maxScore:wx.getStorageSync('maxScore') || 0,
    })
  },
  onReady: function () {

  },
  goPlay:function(){
    wx.navigateTo({
      url: '../../pages/IdiomJielong/IdiomJielong',
    })
  }
})