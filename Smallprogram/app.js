// pages/index/buttons.js
const app = getApp()

App({

    onLaunch: function() {
        var that = this;
        var isshouquan = wx.getStorageSync('isshouquan');
        if (isshouquan == 1) {
            wx.redirectTo({
                url: '/pages/index/index'
            });
        }
    },

    getUserInfo: function(cb) {
        var that = this
        try {
            var userinfo = wx.getStorageSync(this.globalData.cacheKey)
            if (userinfo) {
                typeof cb == "function" && cb(userinfo);
            } else {
                that.userLogin(function(userInfo) {
                    typeof cb == "function" && cb(userInfo);
                })
            }
        } catch (e) {
            //console.log('cache get error!');
        }
        // if (this.globalData.userInfo) {
        //   console.log('istrue');
        //   typeof cb == "function" && cb(this.globalData.userInfo)
        // } else {
        //   //调用登录接口
        //   that.userLogin( function( userInfo ) {
        //     typeof cb == "function" && cb(userInfo)
        //   })
        // }
    },

    userLogin: function(cb) {
        var that = this
        wx.login({
            success: function(res) {
                if (res.code) {
                    var codes = res.code;
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.localUserInfo = res.userInfo;
                            //发起网络请求
                            var openid = null;
                            that.getOpenId(codes, function(openid) {
                                openid = openid;
                                if (openid) {
                                    wx.request({
                                        url: 'https://www.xcbobo.com/xcbb_web/mobile/firSign/openLogin',
                                        method: 'GET',
                                        data: {
                                            username: res.userInfo.nickName,
                                            userId: openid,
                                            type: 3,
                                            unionId: '0',
                                            packageName: 'com.prsoft.vncShow',
                                            version: '1.4.4',
                                            channel: 'appstore',
                                            clientType: 1,
                                            imageUrl: res.userInfo.avatarUrl,
                                            deviceName: 'sunlstest'
                                        },
                                        success: function(res) {
                                            if (res.data.username && res.data.username != '' && res.data.username != undefined && res.data.username != null) {
                                                that.globalData.localUserInfo.nickName = res.data.username;
                                            }
                                            that.setLoginStatus(res.data);
                                            that.globalData.userInfo = res.data
                                            typeof cb == "function" && cb(res.data)
                                        }
                                    })
                                } else {
                                    var tmp = {
                                        uid: that.globalData.anonymousUid,
                                        token: that.globalData.anonymousToken
                                    }
                                    that.setLoginStatus(tmp);
                                    that.globalData.userInfo = tmp;
                                    typeof cb == "function" && cb(tmp);
                                }
                            })
                        },
                        fail: function(err) {
                            var tmp = {
                                uid: that.globalData.anonymousUid,
                                token: that.globalData.anonymousToken
                            }
                            that.setLoginStatus(tmp);
                            that.globalData.userInfo = tmp;
                            typeof cb == "function" && cb(tmp);
                            // wx.showToast({
                            //   title: '您未授权，将以游客身份观看！',
                            //   icon: 'none',
                            //   duration: 1000
                            // })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '登录失败！' + res.errMsg,
                        icon: 'none',
                        duration: 3000
                    })
                }
            }
        })
    },

    getOpenId: function(code, cb) {
        if (code) {
            wx.request({
                url: 'https://www.xcbobo.com/xcbb_web/weixin/miniProgram/loadSessionIdByCode',
                method: 'POST',
                data: {
                    code: code
                },
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function(res) {
                    console.log('code:', code);
                    console.log('getOpenIdurl:', 'https://www.xcbobo.com/xcbb_web/weixin/miniProgram/loadSessionIdByCode');
                    console.log('getOpenId:', res);
                    if (res.data.success) {
                        typeof cb == "function" && cb(res.data.sessionID)
                    } else {
                        typeof cb == "function" && cb(false)
                    }
                },
                fail: function(err) {
                    console.log('get openid fail!');
                }
            })
        }
    },

    setLoginStatus: function(data) {
        try {
            wx.setStorageSync(this.globalData.cacheKey, data);
        } catch (e) {
            console.log('cache error!');
        }
    },

    globalData: {
        userInfo: null,
        anonymousUid: 2037845291,
        anonymousToken: 'TWpBd056QTJNRG5DcDJGMVpuUmlhMmRoTlRBeE5UQTVOamcxTmpBM09USTJ3cWN4TlRJME16QXhPVEl3TlRVMw==',
        localUserInfo: {
            nickName: '游客'
        },
        cacheKey: 'xiaocao_userinfo'
    }

})