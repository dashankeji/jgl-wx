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
        num:1,
        url: app.globalData.urlImages,
        hiddendown:true,
        currentTab:"-1",
        taber:"-1",
        active:0,
        Arraylike:[],
        productAttr: [],
        ClassificationList: [],   //分类列表
        productSelect: [
            { image: "" },
            { store_name: "" },
            { price: 0 },
            { unique: "" },
            { stock: 0 },
        ],
        productValue:[],
        total:'全部',
        animationData:{},
        cid:'',
        sid:'',
        price:'',
        sales:'',
        ficti: '',
        t:1,
        sortyi:[],
        offset: 1,
        title: "玩命加载中...",
        hidden: false,
        show: false,
        prostatus: false,
        sorter:[],
        productid:'',
        CartCount:'',
        shoppingMessage: {                       //商品标识信息
          id: 0,                                //商品标识id
          name: '',                             //商品名字
          img: '',                              //商品图片
          price: 0,                             //商品金额
          num: 0,                               //商品数量
        },
        status: 0,                             //请求添加到购物车时为2
        GB_ClassificationListReqData: [],      //全局保存所有分类数据
        GB_Index: -1,                           //全局保存上次商品的index下标
    },
    swiperChange: function (e) {    //轮播监听变化事件
      this.setData({
        currentSwiper: e.detail.current
      })
    },
    onShow: function(){
      this.tabSelect(null,this.data.TabCur);
      //app.setUserInfo();
    },
    tabSelect(e,id) {               //导航点击事件
      var that = this;

      var cateId = e  ? e.currentTarget.dataset.id : id;
      if (that.data.GbCateId == cateId){
         return;
      }else{
        that.data.offset = 1;
        that.data.TabDate = {};
      }

      that.data.GbCateId = cateId;
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      wx.request({
        url: app.globalData.url + '/routine/auth_api/indexXiaoben?uid=' + app.globalData.uid + '&cate_id=' + cateId,
        method: 'GET',
        header: header,
        success: function (res) {
          var data = res.data.data.all;
          for(var i = 0;i<data.length;i++){
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
        TabCur: cateId
      });
    },
    PriceReduceClick(e) { //商品--
      var that = this;
      var index = e.currentTarget.dataset.index;
      var id = e.currentTarget.dataset.id;
      if (e.currentTarget.dataset.name != that.data.shoppingMessage['name'] && that.data.GB_Index != -1) {
        that.data.TabDate[that.data.GbCateId][that.data.GB_Index].care_num = 0
      }
      that.data.GB_Index = index;

          that.data.shoppingMessage['num'] = e.currentTarget.dataset.num;
      var num = --that.data.shoppingMessage.num;

      if ( num <= 0 ){
           num = 0;
      }
      
      that.data.TabDate[that.data.GbCateId][index].care_num = num;
      that.data.shoppingMessage.num = num;
      that.data.shoppingMessage.price = (parseFloat(e.currentTarget.dataset.price) * num).toFixed(2);
      // console.log(e.currentTarget.dataset.name, that.data.shoppingMessage['name']);
      that.data.shoppingMessage['id'] = id;
      that.data.shoppingMessage['img'] = e.currentTarget.dataset.img;
      that.data.shoppingMessage['name'] = e.currentTarget.dataset.name;

      if(num == 0){
          that.data.shoppingMessage = {
            id: 0,                                //商品标识id
            name: '',                             //商品名字
            img: '',                              //商品图片
            price: 0,                             //商品金额
            num: 0,  
          };
          that.setData({
            status: -1,
            PriceDisabled: true,
            TabDate: that.data.TabDate,
            shoppingMessage: that.data.shoppingMessage
          })
      }else{
          that.setData({
            shoppingMessage: that.data.shoppingMessage,
            status: 2,
            PriceDisabled: false,
            TabDate: that.data.TabDate
          });
      }
    },
    PriceAddClick(e) {      //商品add
        var that = this;
            that.data.shoppingMessage['num'] = e.currentTarget.dataset.num;
          if (e.currentTarget.dataset.name != that.data.shoppingMessage['name'] && that.data.GB_Index != -1) {
             that.data.TabDate[that.data.GbCateId][that.data.GB_Index].care_num = 0
          }
          that.data.GB_Index = e.currentTarget.dataset.index;

          if (e.currentTarget.dataset.stock && that.data.shoppingMessage['num'] >= parseFloat(e.currentTarget.dataset.stock)) {   //库存
            wx.showToast({
              title: '超过最大库存量了',
              icon: 'none',
              duration: 2000
            });
            return;
          };
          that.data.shoppingMessage.num++;

       that.data.TabDate[that.data.GbCateId][e.currentTarget.dataset.index].care_num = that.data.shoppingMessage.num;

        that.data.shoppingMessage.price = (parseFloat(e.currentTarget.dataset.price) * that.data.shoppingMessage.num).toFixed(2);
       // console.log(e.currentTarget.dataset.name, that.data.shoppingMessage['name']);
        that.data.shoppingMessage['id'] = e.currentTarget.dataset.id;
        that.data.shoppingMessage['img'] = e.currentTarget.dataset.img;
        that.data.shoppingMessage['name'] = e.currentTarget.dataset.name;

        that.setData({
          shoppingMessage: that.data.shoppingMessage,
          status: 2,
          PriceDisabled: false,
          TabDate: that.data.TabDate
        });
    },
    addFun: function(){
      var args = arguments,//获取所有的参数
        lens = args.length,//获取参数的长度
        d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0;//定义sum来接收所有数据的和

      for(var key in args) {//遍历所有的参数
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
    PriceDisabled() {       //结算Flag
      var that = this;
      if (false) {
        wx.showToast({
          title: '库存不足' + that.data.num,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          num: that.data.productSelect.stock,
        })
      } else if (false) {
        wx.showToast({
          title: '请选择属性',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (that.data.status == 1) {
          var attrValueData = [];
          for (var i in that.data.productValue) {
            if (that.data.productValue[i].unique == that.data.productSelect.unique) {
              for (var j in that.data.productAttr) {
                for (var k in that.data.productAttr[j].attr_values) {
                  var sukArr = that.data.productValue[i].suk.split(',');
                  if (that.in_array(that.data.productAttr[j].attr_values[k], sukArr)) {
                    attrValueData.push(that.data.productAttr[j].attr_name + ':' + that.data.productAttr[j].attr_values[k]);

                  }
                }
              }

            }
          }
          that.setData({
            attr: '已选',
            attrValue: attrValueData.join(','),
            prostatus: false
          })
        } else if (that.data.status == 2) {
          var header = {
            'content-type': 'application/x-www-form-urlencoded',
          };
          
          wx.request({
            url: app.globalData.url + '/routine/auth_api/set_cart?uid=' + app.globalData.uid,
            method: 'GET',
            data: {
              productId: that.data.shoppingMessage.id,
              cartNum: that.data.shoppingMessage.num,
              uniqueId: ''
            },
            header: header,
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '添加购物车成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.switchTab({
                  url: '../buycar/buycar'
                });
                /*that.setData({
                    prostatus: false
                })*/
                // that.getCartCount();
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (that.data.status == 3) {
          var header = {
            'content-type': 'application/x-www-form-urlencoded',
          };
          wx.request({
            url: app.globalData.url + '/routine/auth_api/now_buy?uid=' + app.globalData.uid,
            method: 'GET',
            data: {
              productId: that.data.id,
              cartNum: that.data.num,
              uniqueId: that.data.productSelect.unique
            },
            header: header,
            success: function (res) {
              if (res.data.code == 200) {
                wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                  url: '/pages/order-confirm/order-confirm?id=' + res.data.data.cartId
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '请点击商品',
            icon: 'success',
            duration: 2000
          });
        }
      }
    },
    setNumber: function (e) {
        var that = this;
        var num = parseInt(e.detail.value);
        that.setData({
            num: num ? num : 1
        })
    },
    onLoad:function(e){
        app.setBarColor();
        app.setUserInfo();
        var that = this;

        that.ClassificationListReq();
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
    ClassificationListReq: function(){
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      };
      var that = this;
      wx.request({
        url: app.globalData.url + '/routine/auth_api/get_product_category?uid=' + app.globalData.uid,
        method: 'POST',
        header: header,
        success: function (res) {
  
          var child = that.ClassificationListReqChild(res.data.data, ['产品销售','数据分类']);
          that.bannerImgDataReq(res.data.data);
      
          if(child != -1 && child.length > 0){
              that.data.ClassificationList = child;
              that.data.TabCur = child[0].id;
              that.tabSelect(null,that.data.TabCur);
              that.setData({
                TabCur: that.data.TabCur,
                ClassificationList: that.data.ClassificationList
              });
          }

        }
      });
    },
    bannerImgDataReq: function(arr){

      var id = this.ClassificationListReqID(arr,['产品销售','轮播']);

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
          if(res.data.data.all.length<1){
             --that.data.offset;
             wx.showToast({
                title: '没有更多的商品了',
                icon: 'none',
                duration: 2000
              })
          }else{
            that.data.TabDate[that.data.GbCateId] =  that.data.TabDate[that.data.GbCateId].concat(res.data.data.all);
             };
          that.setData({
            hidden: false,
            TabDate: that.data.TabDate
          })
        }
      });
     
    },
})