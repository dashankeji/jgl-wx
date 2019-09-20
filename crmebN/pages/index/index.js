//index.js
//获取应用实例
var app = getApp();
var wxh = require('../../utils/wxh.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    currentSwiper: 0,   //轮播焦点
    currentSwiperTwo: 0, //商品轮播焦点
    url: app.globalData.urlImages,
    imgUrls:[],
    lovely:[],
    menus:[],
    indicatorDots: true,//是否显示面板指示点;
    autoplay: true,//是否自动播放;
    interval: 3000,//动画间隔的时间;
    duration: 500,//动画播放的时长;
    indicatorColor: "rgba(51, 51, 51, .3)",
    indicatorActivecolor: "#ffffff",
    recommendList:[],
    newList:[],
    hotList:[],
    benefitList:[],
    likeList:[],
    offset: 1,
    title: "玩命加载中...",
    hidden: false,
    cateIdOne: -1,
    cateIdTwo: -2,
    shoppingBanner: [],
    /**
     * 走马灯
     */
    text: '应召小程序内用户帐号登录规范调整和优化建议,需要把用户登录改为引导方式，望见谅下',
    marqueePace: .5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left', //滚动方向
    intervalTwo: 20, // 时间间隔
    scrollLeft: 0,     //拼团列表left
    TabCur: 0,          //拼团列表选择了那个
    CombinationList: []      //拼团数据
  },
  tabSelect(e) {     //拼团列表点击事件
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  swiperChangeTwo: function (e) {    //商品轮播轮播监听变化事件
    this.setData({
      currentSwiperTwo: e.detail.current
    });
  },
  goUrl:function(e){
    if (e.currentTarget.dataset.url != '#'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  getArticleBanner: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_article_banner?uid=' + app.globalData.uid + '&cid=2&xiaoben=true',
      method: 'GET',
      success: function (res) {
        that.setData({
          shoppingBanner: res.data.data
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  app.setBarColor();
    var that = this;
    if (options.spid){
      app.globalData.spid = options.spid
    }

    that.getArticleBanner();
    that.ClassificationListReq();
    that.getCombinationList();
  },
  getCombinationList: function(){
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_combination_list?uid=' + app.globalData.uid + '&xiaoben=true',
      data: {
        offset: 0,
        limit: 3
      },
      method: 'GET',
      header: header,
      success: function (res) {
          that.setData({
            CombinationList: res.data.data
          });
      }
    });

  },
  getIndexInfo: function (cateIdOne, cateIdTwo, cateIdThree){
    var cateIdOne = cateIdOne ||  -1;
    var cateIdTwo = cateIdTwo || -1;
    var cateIdThree = cateIdThree || -2;

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var that = this;
    wx.request({
      url: app.globalData.url + '/routine/auth_api/index?uid=' + app.globalData.uid + '&cateId_one=' + cateIdOne + '&cateId_two=' + cateIdTwo + '&cateId_Three=' + cateIdThree + '&xiaoben=true',
      method: 'POST',
      header: header,
      success: function (res) {
        var bannerData = res.data.data.banner;
        for (var i = 0; i < bannerData.length; i++){
          if (bannerData[i].url){
            bannerData[i].url = bannerData[i].url.split('—')[1];
          };
        };

        var menusData = res.data.data.menus;
        for (var j = 0; j < menusData.length; j++) {
          if (menusData[j].url) {
            menusData[j].url = menusData[j].url.split('—')[1];
          };
        };

        that.setData({
          imgUrls: bannerData,
          newList: res.data.data.leisureRecreation,//首发新品
          menus: menusData,//导航
          hotList: res.data.data.seasonalGoods,//热卖单品
        });

      }
    })
  },
  ClassificationListReqID: function (arr, arrName) {    //获取分类id
    for (var i = 0; i < arr.length; i++){
      if (arr[i].cate_name == arrName[0] && arrName.length == 1){
        return arr[i].id;
      } 
      if (arr[i].cate_name == arrName[0] && arr[i].child ){
         arrName.splice(0,1);
        return this.ClassificationListReqID(arr[i].child,arrName);
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
      url: app.globalData.url + '/routine/auth_api/get_product_category?uid=' + app.globalData.uid + '&xiaoben=true',
      method: 'POST',
      header: header,
      success: function (res) {
        var seasonalGoodsCateId, leisureRecreationCateId, seasonalGoodsTwoCateId;

            leisureRecreationCateId = that.ClassificationListReqID(res.data.data, ['首页', '休闲娱乐']);
            seasonalGoodsCateId = that.ClassificationListReqID(res.data.data, ['产品销售', '数据分类', '应季蔬菜']);
            seasonalGoodsTwoCateId = that.ClassificationListReqID(res.data.data, ['产品销售', '数据分类', '应季水果']);
            that.getIndexInfo(leisureRecreationCateId, seasonalGoodsCateId, seasonalGoodsTwoCateId);
            
            that.data.cateIdOne = seasonalGoodsCateId;
            that.data.cateIdTwo = seasonalGoodsTwoCateId;
      }
    });
  },
  onReachBottom: function (p) {
    var that = this;

    var limit =  10;
    
    if (that.data.hidden) return;

    var offset = that.data.offset++ * limit;

    that.setData({
      hidden: true,
    });

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/yingJiShangPingOffset?uid=' + app.globalData.uid + '&cateId_one=' + that.data.cateIdOne + '&cateId_two=' + that.data.cateIdTwo + '&xiaoben=true',
      data: { limit: limit, offset: offset },
      method: 'POST',
      header: header,
      success: function (res) {
        var len = res.data.data.length;

        if (len < 1) {
          --that.data.offset;
          wx.showToast({
            title: '数据已经加载到尽头了',
            icon: 'none',
            duration: 2000
          });

        }else{
          that.data.hotList = that.data.hotList.concat(res.data.data);
        };

        that.setData({
          hotList: that.data.hotList,
          hidden: false
        });

      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
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
  /*  let vm = this;
    let length = vm.data.text.length * vm.data.size; //文字长度
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白
    });
    vm.run(); // 水平一行字滚动完了再按照原来的方向滚动*/
  },
  run: function () {
    let vm = this;
    let interval = setInterval(function () {
     
      if (vm.data.marqueeDistance > -vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run();
      }
    }, vm.data.intervalTwo);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '小程序',
      path: '/pages/index/index?spid=' + app.globalData.uid,
      // imageUrl: that.data.url + that.data.product.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})