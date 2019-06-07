import Dialog from '../../dist/dialog/dialog';
var app = getApp();
var db = wx.cloud.database();
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.s_history();
  },
  s_history() {
    var that = this;
    db.collection('s_history').where({
      _openid: app.globalData.id
    }).orderBy('time', 'desc').limit(30)
      .get({
        success(e) {
            that.setData({
              his: e.data
            });
          }
      })
  },

  //分享配置
  onShareAppMessage: function () {
    return {
      title: app.globalData.share_title,
      path: "/pages/index/index",
      imageUrl: app.globalData.share_url
    };
  }, 
})