// pages/yonghuxinxishezhi/index.js
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
    username: '',
    phone: '',
    date: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(options){
      app.setUserInfo();
      var username = options.username;
      var phone = options.phone;
      var date = options.date;
      this.setData({
        username: username,
        phone: phone,
        date: date,
      });
    },
    formReset: function(e){
      this.setData({
        date: '请输入出生日期',
        phone: '请输入联系电话'
      });
    },
    formSubmit: function (e) {
      var username = e.detail.value.username;
      var phone = e.detail.value.phone;
      var date = e.detail.value.date;
      var that = this;

      if (username == ''){
        wx.showModal({
          title: '提示',
          content: '请填写名称先'
        })
      } else if (!/^1(3|4|5|7|8|9)\d{9}$/i.test(phone)){
        wx.showModal({
          title: '提示',
          content: '请填写正确的联系电话先'
        })
      } else if ((date == '')){
        wx.showModal({
          title: '提示',
          content: '请填写出生日期先'
        })
      }else{
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
        };
        wx.request({
          url: app.globalData.url + '/routine/auth_api/fillInMy?uid=' + app.globalData.uid,
          method: 'POST',
          data: {username: username ,phone: phone ,date: date},
          dataType: 'json',
          header: header,
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: '设置完成',
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            });
          }
        });
      };

    }
  }
})
