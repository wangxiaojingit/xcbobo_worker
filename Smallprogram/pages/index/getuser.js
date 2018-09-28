// pages/index/getuser.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btton_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isshouquan = wx.getStorageSync('isshouquan');
    if (isshouquan == 1) {
      wx.redirectTo({
        url: '/pages/index/index'
      });
    }else{
      that.setData({
        btton_show: true
      　　});
    }
  },
  onGotUserInfo: function (e) {
    if (e.detail.userInfo == '' || e.detail.userInfo == undefined || e.detail.userInfo == null) {
      wx.showToast({
        title: '您未授权,将以游客身份观看！',
        icon: 'none',
        duration: 1000,
        success: function () {
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/index/index'
            });
          }, 2000)
        }
      })
    } else {
      app.globalData.localUserInfo = e.detail.userInfo;
      wx.redirectTo({
        url: '/pages/index/index'
      });

      wx.setStorage({
        key: "isshouquan",
        data: "1"
      })
    }
    
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