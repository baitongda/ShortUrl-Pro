import Dialog from '../../dist/dialog/dialog';
var app = getApp();
var db = wx.cloud.database();
var common = require("../../common.js");
Page({

  data: {

  },
  onLoad(){
   this.history();
  },
  history(){
    var that = this;
    db.collection('history').where({
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
  //点击复制短链接
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  //点击历史记录弹窗
  url(e) {
    var url = e.currentTarget.dataset.url;
    Dialog.confirm({
      title: '长链接',
      closeOnClickOverlay: true,
      messageAlign: 'left',
      message: url,
      confirmButtonText: '复制',
      transition: 'fade',
    }).then(() => {
      wx.setClipboardData({
        data: url,
        success: res => {
          wx.showToast({
            title: '已复制链接',
            duration: 1000,
          })
        }
      })
    }).catch(() => {
      console.log('不复制')
    });
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