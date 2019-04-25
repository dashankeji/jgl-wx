// pages/yuanquzongtijieshao/yuanquzongtijieshao.js
const app = getApp()

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
        var content = res.data.data.content;
        var desc = '';
            content = content.split(/<.+">|<\/[a-z]+>|<[a-zA-Z]+>/);
            
            for(var i =0; i<content.length; i++){
                desc += content[i];
            }

            var positionOneArr = [];
            if (res.data.data.image_inputs && res.data.data.image_inputs.length > 2){
                 positionOneArr = res.data.data.image_inputs.split(',');
            }
            var positionTwoArr = [];
            if (res.data.data.image_inputstwo && res.data.data.image_inputstwo.length > 2) {
              positionTwoArr = res.data.data.image_inputstwo.split(',');
            }
           
            var positionTwoTitleArr = [];
            if (res.data.data.image_inputstwo_title && res.data.data.image_inputstwo_title.length > 2){
              positionTwoTitleArr = res.data.data.image_inputstwo_title.split('------');
            }
            
            var positionImgJson = {}, index = 0;
            for (var j = 0; j < positionTwoArr.length; j += 2) {
                  if (positionTwoArr[j].length>2){
                  positionImgJson[j] = {title: [], img: []};
                  positionImgJson[j]['title'].push(positionTwoTitleArr[index]);
                  index++;
                  positionImgJson[j]['img'].push(positionTwoArr[j]); positionImgJson[j]['img'].push(positionTwoArr[j + 1]);
                  }
            }


            that.setData({
                bgImagesUrl: res.data.data.image_input,
                backNavTitle: res.data.data.author,
                Title: res.data.data.title,
                desc: desc,
                oneImagesList: positionOneArr,
                positionImgJson: positionImgJson
            });
        
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