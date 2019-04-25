// pages/home-search/index.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    inputText: '',      //input框的文本值存储
    ActiveId: 0,     //全部分类里当前点击的分类存储
    priceText: 'asc',      //当前点击的价格排序存储
    content: [],        //要显示哪个下拉菜单数据
    priceContent: [{ type: 'asc', value: '价格从低到高' }, { type: 'desc', value: '价格从高到低'}],              //价格下拉菜单数据
    allArcitveContent: [],         //全部分类下拉菜单数据
    pxopen: false,
    priceClickFlag: false,      //判断上个点击是否为价格
    PriceIndex: -1,
    ActiveIndex: -1,
    startpage: 0,
    limit: 100,
    cid: 0,
    shoppingData: [],
    PriceCF: '价格',
    ProductCF: '全部分类'
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onLoad: function () {
      this.ClassificationListReq();
    },

    onShow: function(){
      this.ClassificationListReq();
    },

    shoppingReq: function(keyword){
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_product_list?uid=' + app.globalData.uid,
        data: { sid: this.data.ActiveId, cid: this.data.cid, priceOrder: this.data.priceText, salesOrder: '', news: this.data.news, first: this.data.startpage, keyword: keyword, limit: this.data.limit },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 200) {
            var len = res.data.data.length;
            that.setData({
              shoppingData: res.data.data
            });
            wx.showToast({
              title: '数据获取完成',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: function (res) {
          console.log('submit fail');
        },
        complete: function (res) {
          console.log('submit complete');
        }
      })
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

          var arr = that.ClassificationListReqChild(res.data.data, ['产品销售', '数据分类']);
          var id = that.ClassificationListReqID(res.data.data, ['产品销售', '数据分类']);
              that.data.cid = id;
              arr.unshift({ id: 0, cate_name: '全部分类' });

          that.shoppingReq('');
          that.setData({
            allArcitveContent: arr
           });
          
        }
      });
    },

    searchClick: function () {
      var inputtext = this.data.inputText.replace(/\s+/g, "")
      if(inputtext.length<1){
          wx.showToast({
            title: '请输入关键字',
            icon: 'none',
            duration: 2000
          });
          return;
      };
      this.shoppingReq(inputtext);
    },

    bindkeyblur: function(e){
       this.data.inputText = e.detail.value;
    },

    listPrice: function (e) {     //价格按钮

      if (this.data.pxopen && this.data.priceClickFlag) {
        this.setData({
          pxopen: false,
        })
      } else {
        this.setData({
          pxopen: true,
          content: this.data.priceContent,
          priceClickFlag: true
        })
      };
      
    },

    listAll: function(){        //全部分类按钮

      if (this.data.pxopen && !this.data.priceClickFlag) {
        this.setData({
          pxopen: false,
        })
      } else {
        this.setData({
          pxopen: true,
          content: this.data.allArcitveContent,
          priceClickFlag: false
        })
      };
    },

    ActiveClick: function (e) {     //全部分类里的分类的点击
    
      this.setData({
        ActiveId: e.currentTarget.dataset.id,
        pxopen: false,
        ActiveIndex: e.currentTarget.dataset.index,
        ProductCF: e.currentTarget.dataset.value
      });
      this.shoppingReq('');
    },

    PriceClick: function(e){        //价格里的下拉菜单值点击
    
      this.setData({
        priceText: e.currentTarget.dataset.type,
        pxopen: false,
        PriceIndex: e.currentTarget.dataset.index,
        PriceCF: e.currentTarget.dataset.value
      });
      this.shoppingReq('');
    }
  },
  
})
