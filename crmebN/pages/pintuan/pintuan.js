// pages/pink-list/index.js
var app = getApp();
var wxh = require('../../utils/wxh.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    url: app.globalData.urlImages,
    banner: [],
    offset: 1,
    hidden: true,
    CombinationList: []
  },

  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    app.setBarColor();
    app.setUserInfo();
    /*this.getCombinationList();
    this.getBanner();*/
  },
  getBanner: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_combination_list_banner?uid=' + app.globalData.uid,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          banner: res.data.data
        })
        console.log(that.data.banner);
      }
    })
  },
  getCombinationList: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_combination_list?uid=' + app.globalData.uid,
      data: {
        offset: 0,
        limit: 10
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          CombinationList: res.data.data,
          hidden: false,
        })
      }
    })
  },
  goDetail: function (e) {
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_form_id?uid=' + app.globalData.uid,
      method: 'GET',
      data: {
        formId: e.detail.formId
      },
      success: function (res) { }
    })
    wx.navigateTo({
      url: '/pages/product-pinke/index?id=' + e.detail.value.id,
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
    if(app.globalData.uid == null) return;
    this.setData({ CombinationList: [] });
    this.getCombinationList();
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
    var that = this;
    var limit = 10;

    if (that.data.hidden) return;

    var offset = that.data.offset++ * limit;

    that.setData({
      hidden: true,
    });

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_combination_list?uid=' + app.globalData.uid + '&offset=' + offset + '&limit=' + limit,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.data.length < 1) {
          --that.data.offset;
          wx.showToast({
            title: '没有更多的商品了',
            icon: 'none',
            duration: 2000
          });
        } else {
          that.data.CombinationList = that.data.CombinationList.concat(res.data.data);
        };
        that.setData({
          hidden: false,
          CombinationList: that.data.CombinationList
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})