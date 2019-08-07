// pages/unshop/unshop.js
var app = getApp();
var wxh = require('../../utils/wxh.js');
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    StatusBar: app.globalData.StatusBar,
    currentSwiper: 0,   //轮播焦点
    bannerImgData: [],               //轮播图片存放
    TabCur: 0,                       //当前点击导航的index
    TabSelectValue: 0,               //当前点击导航的值
    PriceDisabled: true,             //是否有金额来判断按钮
    TabDate: {},                     //导航点击对于数据
    ShoppingZongPrice: 0,            //商品总金额
    GbCateId: -1,                    //全局cate_id保存来判断当前选择导航栏是否为上个cate_id
    attrName: '',
    num: 1,
    url: app.globalData.urlImages,
    hiddendown: true,
    currentTab: "-1",
    taber: "-1",
    active: 0,
    Arraylike: [],
    productAttr: [],
    ClassificationList: [],   //分类列表
    productSelect: [
      { image: "" },
      { store_name: "" },
      { price: 0 },
      { unique: "" },
      { stock: 0 },
    ],
    productValue: [],
    total: '全部',
    animationData: {},
    cid: '',
    sid: '',
    price: '',
    sales: '',
    ficti: '',
    t: 1,
    sortyi: [],
    offset: {},
    title: "玩命加载中...",
    hidden: false,
    show: false,
    prostatus: false,
    sorter: [],
    productid: '',
    CartCount: '',
    shoppingMessage: {
    },
    status: 0,                             //请求添加到购物车时为2
    GB_ClassificationListReqData: [],      //全局保存所有分类数据
    GB_Index: -1,                          //全局保存上次商品的index下标
    SettlementShoppingMessage: {           //全局保存所有需要购买商品加起来的数量和金额  
      num: 0,
      price: 0
    }
  },
  swiperChange: function (e) {    //轮播监听变化事件
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onShow: function () {
    this.setData({
      shoppingMessage: {},
      prostatus: false,
      PriceDisabled: true,
      status: 0,
      GbCateId: -1,
      TabCur: 0,
      GB_Index: -1,
      SettlementShoppingMessage: {           //全局保存所有需要购买商品加起来的数量和金额  
        num: 0,
        price: 0
      },
      offset: {},
      TabDate: {}
    });
    app.setUserInfo();

    if(app.globalData.uid == null) return;
    this.ClassificationListReq();

  },
  tabSelect(e, id) {               //导航点击事件
    var that = this;

    var cateId = e ? e.currentTarget.dataset.id : id;

    if (that.data.TabDate[cateId]) {
      that.setData({
        TabCur: cateId,
        GbCateId: cateId
      });
      return;
    };

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + cateId,
      method: 'GET',
      header: header,
      success: function (res) {
        var data = res.data.data.all;
        for (var i = 0; i < data.length; i++) {
          data[i].care_num = 0;
        }
        that.data.TabDate[cateId] = data;
        that.setData({
          TabDate: that.data.TabDate,
          hidden: false
        })
      }
    });
    that.setData({
      hidden: true,
      TabCur: cateId,
      GbCateId: cateId
    });
  },
  PriceReduceClick(e) { //商品--

    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var img = e.currentTarget.dataset.img;
    var name = e.currentTarget.dataset.name;
    var GbCateId = that.data.GbCateId;

    // console.log(e.currentTarget.dataset.price)

    if (that.data.shoppingMessage[GbCateId] == undefined) {
      that.data.shoppingMessage[GbCateId] = [];
    }

    if (that.data.shoppingMessage[GbCateId][index] == undefined) {
      return;
    };

    that.data.shoppingMessage[GbCateId][index]['num'] = e.currentTarget.dataset.num;

    if (--that.data.shoppingMessage[GbCateId][index].num == 0) {
      that.data.SettlementShoppingMessage.num--;
      that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price - parseFloat(e.currentTarget.dataset.price);
      that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price.toFixed(2) - 0;
    }

    var num = that.data.shoppingMessage[GbCateId][index].num;
    if (num <= 0) {
      num = 0;
    }

    that.data.TabDate[GbCateId][index].care_num = num;
    if (num == 0) {

      that.data.shoppingMessage[GbCateId][index] = null;
      var array = that.data.TabDate[GbCateId][index].productAttr;
      for (var jj in array) {
        for (var jjj in array[jj]['attr_values']) {
          array[jj]['attr_value'][jjj].check = false;
        }
      };
      that.data.prostatus = false;

      var flag = true;

      for (var i in that.data.shoppingMessage) {
        for (var j = 0; j < that.data.shoppingMessage[i].length; j++) {
          if (that.data.shoppingMessage[i][j]) {
            flag = false;
            break;
          };
        };
      };
      if (flag) {

        that.setData({
          status: -1,
          PriceDisabled: true,
          prostatus: that.data.prostatus,
          TabDate: that.data.TabDate,
          shoppingMessage: that.data.shoppingMessage,
          SettlementShoppingMessage: {
            num: 0,
            price: 0
          }
        });
        return;
      }
    } else {

      that.data.SettlementShoppingMessage.num--;
      that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price - parseFloat(e.currentTarget.dataset.price);
      that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price.toFixed(2) - 0;

      that.data.shoppingMessage[GbCateId][index].num = num;
      that.data.shoppingMessage[GbCateId][index].price = (parseFloat(e.currentTarget.dataset.price) * num).toFixed(2);

    };

    that.setData({
      shoppingMessage: that.data.shoppingMessage,
      status: 2,
      PriceDisabled: false,
      prostatus: that.data.prostatus,
      TabDate: that.data.TabDate,
      SettlementShoppingMessage: that.data.SettlementShoppingMessage
    });
  },
  PriceAddClick(e) {      //商品add

    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var img = e.currentTarget.dataset.img;
    var name = e.currentTarget.dataset.name;
    var GbCateId = that.data.GbCateId;
    var price = e.currentTarget.dataset.price;

    //console.log(price);
    if (that.data.shoppingMessage[GbCateId] == undefined) {
      that.data.shoppingMessage[GbCateId] = [];
    }

    if (that.data.shoppingMessage[GbCateId][index] == undefined) {
      that.data.shoppingMessage[GbCateId][index] = {};
      that.data.shoppingMessage[GbCateId][index]['id'] = id;
      that.data.shoppingMessage[GbCateId][index]['img'] = img;
      that.data.shoppingMessage[GbCateId][index]['name'] = name;
      that.data.shoppingMessage[GbCateId][index]['unique'] = '';

      that.data.shoppingMessage[GbCateId][index]['num'] = e.currentTarget.dataset.num;
      that.data.shoppingMessage[GbCateId][index]['stock'] = e.currentTarget.dataset.stock;
      that.data.shoppingMessage[GbCateId][index]['price'] = 0;

    };

    if (that.data.TabDate[GbCateId][index].productAttr.length > 0 && that.data.shoppingMessage[GbCateId][index].unique == '') {

      wx.showToast({
        title: '该商品有属性,请选择属性',
        icon: 'none',
        duration: 1000,
      });
      var price = "productSelect.price";
      that.setData({
        shoppingMessage: that.data.shoppingMessage,
        [price]: 0,
      });
      return;
    };

    that.data.shoppingMessage[GbCateId][index]['num'] = e.currentTarget.dataset.num;

    if (e.currentTarget.dataset.stock && that.data.shoppingMessage[GbCateId][index]['num'] >= parseFloat(e.currentTarget.dataset.stock)) {   //库存
      wx.showToast({
        title: '超过最大库存量了',
        icon: 'none',
        duration: 2000
      });
      return;
    };

    that.data.shoppingMessage[GbCateId][index].num++;
    that.data.TabDate[GbCateId][index].care_num = that.data.shoppingMessage[GbCateId][index].num;
    that.data.shoppingMessage[GbCateId][index].price = (parseFloat(price) * that.data.shoppingMessage[GbCateId][index].num).toFixed(2);

    that.data.SettlementShoppingMessage.num++;
    that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price + parseFloat(price);
    that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price.toFixed(2) - 0;

    that.setData({
      shoppingMessage: that.data.shoppingMessage,
      status: 2,
      GB_Index: index,
      PriceDisabled: false,
      TabDate: that.data.TabDate,
      SettlementShoppingMessage: that.data.SettlementShoppingMessage
    });
    //console.log(that.data.shoppingMessage,that.data.productAttr)
  },
  addFun: function () {
    var args = arguments,//获取所有的参数
      lens = args.length,//获取参数的长度
      d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
      sum = 0;//定义sum来接收所有数据的和

    for (var key in args) {//遍历所有的参数
      //把数字转为字符串
      var str = "" + args[key];
      if (str.indexOf(".") != -1) {//判断数字是否为小数
        //获取小数位的长度
        var temp = str.split(".")[1].length;
        //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
        d = d < temp ? temp : d;
      }
    };
    //计算需要乘的数值
    var m = Math.pow(10, d);
    //遍历所有参数并相加
    for (var key in args) {
      sum += args[key] * m;
    }
    //返回结果
    return sum / m;
  },
  tapsize: function (e) {
    var that = this;
    var productAttr = that.data.TabDate[that.data.GbCateId][that.data.GB_Index].productAttr;
    var productValue = that.data.TabDate[that.data.GbCateId][that.data.GB_Index].productValue;

    var key = e.currentTarget.dataset.key;
    var attrValues = [];
    var attrName = that.data.attrName;
    var attrNameArr = attrName.split(",");
    var array = productAttr;
    for (var i in productAttr) {
      for (var j in productAttr[i]['attr_values']) {
        if (productAttr[i]['attr_values'][j] == key) {
          attrValues = productAttr[i]['attr_values'];
        }
      }
    }
    for (var ii in attrNameArr) {
      if (that.in_array(attrNameArr[ii], attrValues)) {
        attrNameArr.splice(ii, 1);
      }
    }
    attrName = attrNameArr.join(',');
    if (attrName) var eName = e.currentTarget.dataset.key + ',' + attrName;
    else var eName = e.currentTarget.dataset.key;
    attrNameArr = eName.split(",");
    var isBool = false;
    var isattrNameArrLength = 0;
    for (var an in attrNameArr) {
      if (attrNameArr[an]) isattrNameArrLength = isattrNameArrLength + 1;
    }
    for (var b in productValue) {
      var sukValue = productValue[b].suk.split(",");
      if (sukValue.length == isattrNameArrLength) {
        if (that.in_array_two(attrNameArr, sukValue)) {
          isBool = true;
        }
      } else {
        isBool = true;
      }
    }
    if (!isBool) {
      wx.showToast({
        title: '属性不存在，请重新选择',
        icon: 'none',
        duration: 1500,
      })
    } else {
      that.setData({
        attrName: e.currentTarget.dataset.key + ',' + attrName
      })
      attrNameArr = that.data.attrName.split(",");
      var attrNameArrSort = '';
      for (var jj in productAttr) {
        for (var jjj in productAttr[jj]['attr_values']) {
          if (that.in_array(productAttr[jj]['attr_values'][jjj], attrNameArr)) {
            attrNameArrSort += productAttr[jj]['attr_values'][jjj] + ',';
          }
        }
      };
      for (var jj in array) {
        for (var jjj in array[jj]['attr_values']) {
          if (that.in_array(array[jj]['attr_values'][jjj], attrNameArr)) {
            array[jj]['attr_value'][jjj].check = true;
          } else {
            array[jj]['attr_value'][jjj].check = false;
          }
        }
      };
      that.setData({
        productAttr: array
      })
      var attrNameArrSortArr = attrNameArrSort.split(",");
      attrNameArrSortArr.pop();
      that.setData({
        attrName: attrNameArrSortArr.join(',')
      })
      var arrAttrName = that.data.attrName.split(",");
      for (var index in productValue) {
        var strValue = productValue[index]['suk'];
        var arrValue = strValue.split(",");
        if (that.in_array_two(arrValue, arrAttrName)) {

          var num = that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].num;
          that.data.SettlementShoppingMessage.num = that.data.SettlementShoppingMessage.num - num + 1

          that.data.SettlementShoppingMessage.price -= that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].price;
          that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price.toFixed(2) - 0;
          that.data.SettlementShoppingMessage.price += parseFloat(productValue[index]['price']);
          that.data.SettlementShoppingMessage.price = that.data.SettlementShoppingMessage.price.toFixed(2) - 0;

          that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].img = productValue[index]['image'];
          that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].price = productValue[index]['price'];
          that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].stock = productValue[index]['stock'];
          that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].unique = productValue[index]['unique'];
          that.data.shoppingMessage[that.data.GbCateId][that.data.GB_Index].num = 1;

          that.data.TabDate[that.data.GbCateId][that.data.GB_Index].care_num = 1;
          that.data.TabDate[that.data.GbCateId][that.data.GB_Index].price = productValue[index]['price'];
          that.data.TabDate[that.data.GbCateId][that.data.GB_Index].image = productValue[index]['image'];
          that.data.TabDate[that.data.GbCateId][that.data.GB_Index].stock = productValue[index]['stock'];

          var price = "productSelect.price";

          that.setData({
            PriceDisabled: false,
            shoppingMessage: that.data.shoppingMessage,
            [price]: that.data.productValue[index]['price'],
            TabDate: that.data.TabDate,
            SettlementShoppingMessage: that.data.SettlementShoppingMessage
          })
        }
      }
    }
  },
  in_array_two: function (arr1, arr2) {
    if (arr1.sort().toString() == arr2.sort().toString()) {
      return true;
    }
    else {
      return false;
    }

  },
  in_array: function (str, arr) {
    for (var f1 in arr) {
      if (arr[f1] == str) {
        return true;
      }
    }
  },
  modelbg: function (e) {
    this.setData({
      prostatus: false
    });
  },
  showModelbg: function (e) {
    var index = 0;
    var that = this;
    var GbCateId = that.data.GbCateId;
    index = e ? e.currentTarget.dataset.index : that.data.GB_Index;

    if (that.data.shoppingMessage[GbCateId] == undefined) {
      that.data.shoppingMessage[GbCateId] = [];
    }

    if (that.data.shoppingMessage[GbCateId][index] == undefined) {
      that.data.shoppingMessage[GbCateId][index] = {};

      that.data.shoppingMessage[GbCateId][index]['id'] = that.data.TabDate[GbCateId][index]['id'];
      that.data.shoppingMessage[GbCateId][index]['img'] = that.data.TabDate[GbCateId][index]['image'];
      that.data.shoppingMessage[GbCateId][index]['name'] = that.data.TabDate[GbCateId][index]['store_name'];
      that.data.shoppingMessage[GbCateId][index]['unique'] = '';
      that.data.shoppingMessage[GbCateId][index]['num'] = that.data.TabDate[GbCateId][index]['care_num'];
      that.data.shoppingMessage[GbCateId][index]['stock'] = that.data.TabDate[GbCateId][index]['stock'];
      that.data.shoppingMessage[GbCateId][index]['price'] = 0;
      var price = "productSelect.price";
      that.setData({
        shoppingMessage: that.data.shoppingMessage,
        [price]: 0,
      });
    };

    that.setData({
      prostatus: true,
      GB_Index: index,
      productAttr: that.data.TabDate[GbCateId][index].productAttr,
      productValue: that.data.TabDate[GbCateId][index].productValue,
    })
  },
  PriceDisabled() {       //结算Flag
    var that = this;

    var shoppingMessageData = that.data.shoppingMessage;

    for (var j in shoppingMessageData) {

      for (var i in shoppingMessageData[j]) {

        if (that.data.shoppingMessage[j][i] && that.data.shoppingMessage[j][i].num > 0) {

          if (that.data.TabDate[j][i].productAttr.length > 0 && that.data.shoppingMessage[j][i].unique == '') {

            wx.showToast({
              title: '请选择' + that.data.shoppingMessage[j][i].name + '属性',
              icon: 'none',
              duration: 2000,
            });
            return;
          };
        } else {
          that.data.shoppingMessage[j][i] = null;
        };
      };

    };


    var header = {
      'content-type': 'application/json',  //application/json
    };
    var data = that.data.shoppingMessage;

    wx.request({
      url: app.globalData.url + '/routine/auth_api/set_cartJson?uid=' + app.globalData.uid,
      method: 'POST',
      data: JSON.stringify(data),
      header: header,
      success: function (res) {
        for (var j in res.data.data) {

          if (res.data.data[j].code != 200) {
            wx.showToast({
              title: '添加' + res.data.data[j].cart + '购物车失败',
              icon: 'success',
              duration: 1000
            });
          };
        };
        wx.switchTab({
          url: '../buycar/buycar'
        });
      }
    });

  },
  subBuy() {       //确定规格后关闭弹窗
    this.modelbg();
  },
  setNumber: function (e) {
    var that = this;
    var num = parseInt(e.detail.value);
    that.setData({
      num: num ? num : 1
    })
  },
  onLoad: function (e) {
    app.setBarColor();

    //this.ClassificationListReq();
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

        var child = that.ClassificationListReqChild(res.data.data, ['产品销售', '数据分类']);
        that.bannerImgDataReq(res.data.data);

        if (child != -1 && child.length > 0) {
          that.data.ClassificationList = child;
          that.data.TabCur = child[0].id;
          that.tabSelect(null, that.data.TabCur);
          that.setData({
            TabCur: that.data.TabCur,
            ClassificationList: that.data.ClassificationList
          });
        }

      }
    });
  },
  bannerImgDataReq: function (arr) {

    var id = this.ClassificationListReqID(arr, ['产品销售', '轮播']);

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
  onReachBottom: function () {
    var that = this;
    var limit = 8;

    if (that.data.hidden) return;
    if (!that.data.offset[that.data.GbCateId]) that.data.offset[that.data.GbCateId] = 1;

    var offset = that.data.offset[that.data.GbCateId]++ * limit;

    that.setData({
      hidden: true,
    });

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    wx.request({
      url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + that.data.GbCateId + '&offset=' + offset + '&limit=' + limit,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.data.all.length < 1) {
          --that.data.offset[that.data.GbCateId];
          wx.showToast({
            title: '没有更多的商品了',
            icon: 'none',
            duration: 2000
          })
        } else {
          var data = res.data.data.all;
          for (var i = 0; i < data.length; i++) {
            data[i].care_num = 0;
          };
          that.data.TabDate[that.data.GbCateId] = that.data.TabDate[that.data.GbCateId].concat(data);
        };
        that.setData({
          hidden: false,
          TabDate: that.data.TabDate
        });
      }
    });

  },
})