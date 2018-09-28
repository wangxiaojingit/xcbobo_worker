const app = getApp()

Page({

  data: {
    shujlist:[],
    off:true,
    page:1,
    userInfo: {}
  },

  onShow: function () {
    var that = this;
    that.common();
    // this.onLoad();
    // if (wx.pageScrollTo) {
    //   wx.pageScrollTo({
    //     scrollTop: 0
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
  },

  common:function(){
    var that = this;
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })  
      // wx.showLoading({
      //   title: 'loading...',
      // })
      that.getApi(userInfo.uid, userInfo.token, 1, function( res ) {      
        if(res.data){
          var res = res.data;
          if(res.list.length < 20){
            var off = false;
          } else {
            var off = true;
          }
          that.setData({
            shujlist: res.list,
            off:off
          })
        }else{
          console.log('data is null');
          that.common();
        }
      })  
    })  
  },
  
  onLoad: function () {
      this.common();
  },

  getApi: function(uid, token, page, cb) {
    var that = this;
    // wx.showLoading({
    //   title: 'loading...',
    // })
    wx.request({
      url: 'https://www.xcbobo.com/xcbb_web/mobileLive/searchRecentUserLiveResult',
      method:'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        sex:2,
        province:'北京',
        type:3,
        page: page,
        pageSize:20,
        token: token,
        packageName:'pc',
        version:'pc',
        channel:'pc',
        clientType:'3',
        uid: uid
      },
      success: function (res) {
        //console.log(res);
        //wx.hideLoading();
        typeof cb == "function" && cb(res)
      },
      fail:function(){
        //wx.hideLoading();
        console.log('request error');
      }
    })
  },

  loaddata:function(){    
    console.log('loaddata');
    this.onPullDownRefresh();
  },

  onPullDownRefresh: function () {    
    this.setData({
      page: 1
    })
    wx.stopPullDownRefresh()
    this.common();
  },

  onReachBottom: function () {
    var that = this;
    if(that.data.off == true){
      var pages = ++that.data.page;
       that.getApi(that.data.userInfo.uid, that.data.userInfo.token, pages, function( res ) {
          var ret = res.data;
          that.setData({
            shujlist: that.data.shujlist.concat(ret.list)
          });
          if (ret.list.length < 20) {
            that.setData({
              off: false
            });
          } else {
            pages++;
            that.setData({
              page: pages
            });
          }
       })  
    }else{
      wx.showToast({
        title: '没有更多啦',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onShareAppMessage: function () {
  	var that = this;
    return {
      title: '小草直播',
      path: '/pages/index/getuser'
    }
  }

})
