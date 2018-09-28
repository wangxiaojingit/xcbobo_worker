const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: { isLive:1},
    nickName: '',
    username: '',
    userimg: '',
    zid:'',
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var nickName = app.globalData.localUserInfo.nickName;
    wx.showLoading({
      title: 'loading...',
    })

    that.setData({
      nickName: nickName,
      username: options.username,
      userimg: options.userimg,
      uid: options.uid,
      zid: options.zid
    })
    wx.setNavigationBarTitle({
      title: that.data.username
    })
    //循环更新主播数据
    setInterval(function(){

      wx.request({
        url: 'https://www.xcbobo.com/xcbb_web/h5Activity/getSharePageInfo',
        data: {
          uid: that.data.uid,
          zid: that.data.zid,
          type: 2
        },
        success: function (res) {
          wx.hideLoading();
          var ret = res.data;
          console.log("更新主播信息："+ret)

          //res.rtmburl = res.rtmburl.replace('http', 'https');
          that.setData({
            res: ret
          })
        }
      })

    },3000)
  },
  onShow: function (){
    var voide = wx.createVideoContext('myVideo');
    voide.play();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '我是' + that.data.username + '欢迎观看我的直播',
      path: 'pages/index/index_xq?uid=' + that.data.uid + '&zid=' + that.data.zid + '&username=' + that.data.username + '&userimg=' + that.data.userimg,
      imageUrl: that.data.userimg
    }
  }
})