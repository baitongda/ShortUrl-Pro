import Dialog from '../../dist/dialog/dialog';
var app = getApp();
var db = wx.cloud.database();
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '1',
    imgUrls: [
      'https://ws3.sinaimg.cn/large/005BYqpggy1g3rup2bvnuj30rs0ch0um.jpg',
      'https://ws3.sinaimg.cn/large/005BYqpggy1g3rtkiod9pj30rs0ciwhi.jpg',
      'https://ws3.sinaimg.cn/large/005BYqpggy1g3rtyliggdj30rs0citcu.jpg'
    ],
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  onLoad(){
this.high();
  },
  high(){
    var that = this;
    var width = app.globalData.windowWidth;
    var high = width*9/20;
    that.setData({
      high:high
    })
  },
  kefu(){
    var that = this;
    that.copy();
    Dialog.alert({
      message: '已复制客服微信:xuhuai66，赶快去加上吧',
      closeOnClickOverlay:true
    }).then(() => {
    });
  },
  copy() {
    wx.setClipboardData({
      data: 'xuhuai66',
      success: res => {
        wx.showToast({
          title: '已复制',
          duration:300,
        })
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