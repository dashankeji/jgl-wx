//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Title: '老金钱龟农庄',
    currentSwiper: 0,   //轮播
    imgUrls: [],        //轮播图片
    hidden: true,
    tabSelectCssFlag: { 0: true, 1: false },   //0为菜单 1为店家
    menuSwitcnDateIndex: 0,          //菜单按钮的下标
    menuSwitcnTitle: ['正在请求'],
    menuTitle: '正在请求',      //右边标题
    menuSwitcnDate: {},                     //菜单切换的数据
    offset: 1,
    GbCateId: -1,
    address: {},                //店家地址数据
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
  ClassificationListReqChild: function (arr, arrName) {    //获取分类child
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].cate_name == arrName[0] && arrName.length == 1) {
        return arr[i].child;
      }
      if (arr[i].cate_name == arrName[0] && arr[i].child) {
        arrName.splice(0, 1);
        return this.ClassificationListReqChild(arr[i].child, arrName);
      }
    }
    return -1;
  },
  ClassificationListReq: function () {
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_product_category?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].cate_name == '餐饮') {
            var child = res.data.data[i].child;
            that.setData({
              menuSwitcnTitle: res.data.data[i].child,
              menuSwitcnDateIndex: res.data.data[i].child[0].id,
              menuTitle: res.data.data[i].child[0].cate_name
            });
            that.menuSwitchClick(null, that.data.menuSwitcnDateIndex, that.data.menuTitle);
            break;
          }
        }

      }
    });
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  tabClickMenu: function () {       //菜单和店家切换（这里是菜单按钮）
    this.setData({
      tabSelectCssFlag: { 0: true, 1: false }
    });
  },
  tabClickShopOwner: function () {    //菜单和店家切换（这里是店家按钮）
    this.setData({
      tabSelectCssFlag: { 0: false, 1: true }
    });
  },
  menuSwitchClick: function (e,id,title) {          //菜单切换按钮
    var that = this;
    var cateId = e ? e.currentTarget.dataset.id : id;
    var cate_name = e ? e.currentTarget.dataset.title : title;
    
    if(that.data.GbCateId == cateId) {
      return;
    } else {
      that.data.offset = 1;
      that.data.menuSwitcnDate = {};
    }
    that.data.GbCateId = cateId;
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
   
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + cateId,
      method: 'POST',
      header: header,
      success: function (res) {
        that.data.menuSwitcnDate[cateId] = res.data.data.all;
        that.setData({
          menuSwitcnDate: that.data.menuSwitcnDate,
          hidden: false
        })
      }
    });
    that.setData({
      hidden: true,
      menuSwitcnDateIndex: cateId,
      menuTitle: cate_name
    });

  },
  onReachBottom: function () {
    var that = this;
    var limit = 0;

    if (that.data.hidden) return;
    ++that.data.offset;
    limit = that.data.offset * 8;

    that.setData({
      hidden: true,
    });

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + that.data.GbCateId + '&offset=' + (limit - 8) + '&limit=' + limit,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.data.all.length < 1) {
          --that.data.offset;
          wx.showToast({
            title: '没有更多的商品了',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.data.menuSwitcnDate[that.data.GbCateId] = that.data.menuSwitcnDate[that.data.GbCateId].concat(res.data.data.all);
        };
        that.setData({
          hidden: false,
          menuSwitcnDate: that.data.menuSwitcnDate
        })
      }
    });

  },
  getEbStoreEstaurantAddress(){
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_eb_store_estaurant_address?uid=' + app.globalData.uid,
        method: 'GET',
        header: header,
        success: function (res) {
          
          that.setData({
            address: res.data.data[0]
          });
        }
      });
  },
  /*upper(e) {
    console.log(e)
  },
  lower(e) {
    console.log(e)
  },
  scroll(e) {
    console.log(e)
  },*/
  onLoad: function () {
    app.setUserInfo();
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/index?uid=' + app.globalData.uid,
      method: 'POST',
      header: header,
      success: function (res) {
       
        that.setData({
          imgUrls: res.data.data.banner,
        })
      }
    });
    that.ClassificationListReq();
    that.getEbStoreEstaurantAddress();   //店家地址

  },
  onShow: function () {
    app.setUserInfo();
  }
})
