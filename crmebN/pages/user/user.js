var app = getApp();
var wxh = require('../../utils/wxh.js');
// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  CustomBar: app.globalData.CustomBar,
  StatusBar: app.globalData.StatusBar,
  url: app.globalData.urlImages,
  userinfo:[],
  orderStatusNum:[],
  bannerImgData:[],
  coupon:'',
  collect:'',
  ListTitleData: {               //个人中心显示数据
      0:[
        { title: '待付款', link: '/pages/orders-list/orders-list?nowstatus=1', imgUrl: '' },
        { title: '待发货', link: '/pages/orders-list/orders-list?nowstatus=2', imgUrl: '' }, 
        { title: '待收货', link: '/pages/orders-list/orders-list?nowstatus=3', imgUrl: '' }, 
        { title: '待评价', link: '/pages/orders-list/orders-list?nowstatus=4', imgUrl: '' }, 
        { title: '退款/售后', link: '/pages/refund-order/refund-order', imgUrl: '' }, 
        ],
      1:[
          {}
        ]

    }
  },

  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },
  ClassificationListReqID: function (arr, arrName) {    //获取分类id
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].cate_name == arrName[0] && arrName.length == 1) {
        return arr[i].id;
      }
      if (arr[i].cate_name == arrName[0] && arr[i].child) {
        arrName.splice(0, 1);
        return this.ClassificationListReqID(arr[i].child, arrName);
      }
    }
    return -1;
  },
  ClassificationListReq: function () {    //获取所有分类
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_product_category?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        that.bannerImgDataReq(res.data.data);
        that.ListTitleData0(res.data.data);
      }
    });
  },
  bannerImgDataReq: function(arr){
      var id = this.ClassificationListReqID(arr,['我的','轮播']);
      var that = this;
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + id,
        method: 'GET',
        header: header,
        success: function (res) {
        
          that.setData({
            bannerImgData: res.data.data.all
          });
        }
      });
  },
  ListTitleData0: function (arr) {
    var id = this.ClassificationListReqID(arr, ['我的', '货物']);
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + id,
      method: 'GET',
      header: header,
      success: function (res) {
        
          var data = res.data.data.all;
          for(var i=0;i<data.length;i++){
               that.data.ListTitleData[0][i].imgUrl = data[i].image; 
          };
          that.setData({
            ListTitleData: that.data.ListTitleData
          });
      }
    });
  },
  ListTitleData1: function (arr) {
    var id = this.ClassificationListReqID(arr, ['我的', '货物下面']);
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + id,
      method: 'GET',
      header: header,
      success: function (res) {

        that.setData({
          bannerImgData: res.data.data.all
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();
   
    this.ClassificationListReq();
  },
  goNotification:function(){
      wx.navigateTo({
        url: '/pages/news-list/news-list',
      })
  },
  onShow: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/my?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        if (res.data.data.fill_in_nickname != '请输入昵称') res.data.data.nickname = res.data.data.fill_in_nickname;
        that.setData({
          userinfo: res.data.data,
          orderStatusNum: res.data.data.orderStatusNum
        })
      }
    });
  },
  wodecaifuClick: function(){
    wx.navigateTo({
      url: '/pages/wodecaifu/wodecaifu'
    });
  },
   /**
   * 生命周期函数--我的二维码
   */
  wodeerweimaClick:function(){
      wx.navigateTo({
        url: '/pages/promotion-card/promotion-card'
      });
  },
   /**
   * 生命周期函数--我的余额
   */
  money:function(){
    wx.navigateTo({
      url: '/pages/main/main?now=' + this.data.userinfo.now_money + '&uid='+app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的积分
   */
  integral: function () {
    wx.navigateTo({
      url: '/pages/integral-con/integral-con?inte=' + this.data.userinfo.integral + '&uid=' + app.globalData.uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
 * 生命周期函数--拼团
 */
  pintuanClick: function () {
    
    wx.navigateTo({
      url: '/pages/pintuan/pintuan'
    })
  },
   /**
   * 生命周期函数--秒杀
   */
  miaoshaClick: function(){
    wx.navigateTo({
      url: '/pages/miaosha/miaosha'
    })
  },
   /**
   * 生命周期函数--我的优惠卷
   */
  coupons: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的收藏
   */
  collects: function () {
    wx.navigateTo({
      url: '/pages/wodeshoucang/wodeshoucang',
    })
  },
  /**
 * 生命周期函数--全部订单
 */
  quanbudingdanClick: function () {
    wx.navigateTo({
      url: '/pages/orders-list/orders-list',
    })
  },
  /**
   * 生命周期函数--收货地址
   */
  shouhuodizhiClick: function(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
   /**
   * 生命周期函数--我的推广人
   */
  extension:function(){
    wx.navigateTo({
      url: '/pages/feree/feree',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的推广
   */
  myextension: function () {
    wx.navigateTo({
      url: '/pages/extension/extension',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的砍价
   */
  // cut_down_the_price:function(){
  //   wx.navigateTo({
  //     url: '../../pages/feree/feree',
  //     success: function (res) { },
  //     fail: function (res) { },
  //     complete: function (res) { },
  //   })
  // }
})