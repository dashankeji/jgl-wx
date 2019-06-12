// pages/yuanquzongtijieshao/yuanquzongtijieshao.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    newId: 0,
    backNavTitle: '',
    Title: '',
    bgImagesUrl: '',
    oneImagesList: [],
    positionImgJson: {},
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.id) {
      that.setData({
        newId: options.id
      })
      that.getContent();
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none',
        duration: 1000,
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)
    }
  },
  getContent: function () {    //根据id请求园区总体信息
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/visit?uid=' + app.globalData.uid,
      method: 'GET',
      data: {
        id: that.data.newId,
      },
      success: function (res) {
        that.setData({
          backNavTitle: res.data.data.author
        })
       
        WxParse.wxParse('content', 'html', res.data.data.image_inputstwo_title, that, 0);
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})