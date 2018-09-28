/**
 * Created by wangxiaojin on 2017/4/11.
 */

$(function(){
    //获取页面上的参数
    function parameter() {
        var url = document.location.href;
        //  var url="http://www.xiuktv.com/xcbb_web/h5Activity/getSharePageInfo?zid=10004125&uid=10004122&type=1&sex=1&page=1&pageSize=100&token=123&province=111&nice=小辣"
        var obj = {};
        var tem = [];
        if(url.indexOf("?")>0){
            var ary = url.split("?")[1].split("&");
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                tem = cur.split("=");
                obj[tem[0]] = tem[1];
            }
        }
        return obj;
    }
    //获取当前打开的网址
    var currentUrl=window.location.href;
    var urlType="";
    //判断是在哪个环境中打开的
    if(currentUrl.indexOf("www.xiuktv.com")>0){
        //证明是在www.xiuktv.com打开的
        //urlType="http://www.xiuktv.com/"
        urlType="1";
        urlType1="http://www.xiuktv.com/";
    }else{
        //说明是在www.
        /* urlType = "https://www.xcbobo.com/";*/
        urlType="2";
        urlType1="https://www.xcbobo.com/";
    }
    var code=parameter().code;
    var openid="";
    var sex=0;
    var nickname="";
    var city= "";
    var province= "";
    var country= "";
    var headimgurl= "";
    var device="";
    //用户统计
   
    //页面上有多少个用户参加活动的显示http://localhost:8081/xcbb_open/eventtj/game_user_tj/get
    var url8=urlType1+"xcbb_open/eventtj/game_user_tj/get";
    $.ajax({
        url:url8,    //请求的url地址
        dataType:"json",   //返回格式为json
        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
        type:"GET",   //请求方式
        cache:false,
        success:function(data){
            if(data.success){
                $("#people").html(data.result);
            }else{
                console.log("调取人数接口失败")
            }

        }

    });
    var aaurl=window.location.href;
    localStorage.setItem("durl",aaurl);
    aaurl=encodeURIComponent(aaurl.split("#")[0]) ;
    localStorage.setItem("aaurl",aaurl);
    //获取用户基本信息
    var url=urlType1+"xcbb_open/event/getWexinUserInfo?code="+code;
    $.ajax({
        url:url,    //请求的url地址
        dataType:"json",   //返回格式为json
        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
        type:"GET",   //请求方式
        cache:false,
        success:function(data){
            if(data.success){
                //头像等信息
                var dataInfo= data.result;
                openid=dataInfo.openid;
                localStorage.setItem("openid",dataInfo.openid);
                localStorage.setItem("nickname",dataInfo.nickname);
                localStorage.setItem("city",dataInfo.city);
                localStorage.setItem("province",dataInfo.province);
                localStorage.setItem("country",dataInfo.country);
                localStorage.setItem("headimgurl",dataInfo.headimgurl);
                localStorage.setItem("device",dataInfo.device);
                localStorage.setItem("sex",dataInfo.sex);
            }

        }
    });
    openid= localStorage.getItem("openid");
    //获取jsapi签名信息接口http://www.xiuktv.com/xcbb_open/event/getJsapiSign?url=http://localhost:8081/xcbb_open/eventtj/pv
    var url5=urlType1+"xcbb_open/event/getJsapiSign?url="+aaurl;
    $.ajax({
        url:url5,    //请求的url地址
        dataType:"json",   //返回格式为json
        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
        type:"GET",   //请求方式
        cache:false,
        success:function(data){
            if(data.success){
                var data=data.result;
                var appId=data.appid;
                var timestamp=data.timestamp;
                var nonceStr=data.nonceStr;
                var signature=data.signature;
                weixinCallback(appId,timestamp,nonceStr,signature);
            }

        }

    });
    function weixinCallback (appId,timestamp,nonceStr,signature) {
        //微信分享配置
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: ['checkJsApi','onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        //判断当前客户端版本是否支持指定的js接口
        var imgShareUrl=localStorage.getItem("headimgurl");
        var shareTitle="你敢来一起啪啪啪吗?";
        var sharelink='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx301d36d30e628ebf&redirect_uri='+urlType1+'xcbb_web/wh5/playFace/index.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect ';
        var aaName= localStorage.getItem("nickname");
        var content=aaName+"正在 啪啪啪，邀请你来战!";
        /*var imgShareUrl=urlType1+"xcbb_web/wh5/playFace/images/share.png";*/
        //如果支持分享给朋友圈的时候开始!
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: "你敢来一起啪啪啪吗?", // 分享标题
                link:window.location.href,
                imgUrl: localStorage.getItem("headimgurl"), // 分享图标
                success: function () {
                    
                    // 用户确认分享后执行的回调函数 t=2 代表朋友圈分享成功
                    //请求分享成功接口 http://localhost:8081/xcbb_open/eventtj/share/save?openid=1222
                    var url10=urlType1+"xcbb_open/eventtj/share/save?openid="+openid+"&type=2";
                    $.ajax({
                        url:url10,    //请求的url地址
                        dataType:"json",   //返回格式为json
                        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                        type:"GET",   //请求方式
                        cache:false,
                        success:function(data){
                            if(data.success){
                                console.log("分享接口请求成功")
                            }else{
                                console.log("分享接口请求失败")
                            }

                        }

                    });
                },
                
                fail:function(){
                    //alert("fail");
                }
            });
            //如果支持分享给朋友圈的时候结束!
            //获取“分享给朋友”按钮点击状态及自定义分享内容接口开始
            wx.onMenuShareAppMessage({
                title: "你敢来一起啪啪啪吗?", // 分享标题
                desc: localStorage.getItem("nickname")+"正在 啪啪啪，邀请你来战!", // 分享描述
                link:window.location.href,
                imgUrl: localStorage.getItem("headimgurl"), // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数 t=1 代表是来自好友分享 t=2 代表来自朋友圈分享
                    var url11=urlType1+"xcbb_open/eventtj/share/save?openid="+openid+"&type=1";
                    $.ajax({
                        url:url11,    //请求的url地址
                        dataType:"json",   //返回格式为json
                        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                        type:"GET",   //请求方式
                        cache:false,
                        success:function(data){
                            if(data.success){
                                console.log("分享接口请求成功");
                            }else{
                                console.log("分享接口请求失败");
                            }
                        }
                    });
                },
               
                fail:function(){
                    
                }
            });
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        })



    }


    /*footer底部的滚动屏
     *原理:开启定时器,每1000ms的时候,就让num+=5,然后让footerIn的left值
     * 总共有6个li,真正的是4个li,后面的两个是头两个的克隆
     * */

    //获取手机屏幕的宽度,也就是footer里面两个li的宽度
    var phoneW=document.documentElement.clientWidth||document.body.clientWidth;
    //每个li的宽度
    var liW=phoneW/2;
    $(".footerIn li").css("width",liW+"px");
    //算出真正的li的总宽度(目前4个);
    var targetLi=Number(liW*4);
    var num= 0,timer=null;
    timer=setInterval(function(){
        num+=5;
        //如果达到了真正的4个li的宽度,我们一瞬间让ul回到起始的位置
        if(num>targetLi){
            $(".footerIn").css("left","0px");
            num=0;
        }

        $(".footerIn").css("left",-num+"px");
    },500)

    //点击活动锦囊的时候,让其活动说明出现
    $(".jinnang").click(function(){
        $(".paihang").show();
    })

    $(".close").click(function(){
        $(".paihang").hide();
    })
    //点击排行榜上面的哪个li的时候就让相应的内容出现
    $(".paihangTop  li").click(function(){

        if($(this).index()==1){
            //请求排行榜的接口
            var ph=$(".conboxs .conbox ").eq(1).height();

            var url3=urlType1+"xcbb_open/event/getScore_top10";
            $.ajax({
                url:url3,    //请求的url地址
                dataType:"json",   //返回格式为json
                async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                type:"GET",   //请求方式
                cache:false,
                success:function(data){
                    if(data.success){
                        var data=data.result;
                        var str="";
                        for(var i=0;i<data.length;i++){
                            str+="<li class='clearfix'>";
                            var num=Number(i+1);
                            str+="<span><span>No.</span><span id='num'>"+num+"</span></span>" ;
                            str+="<span class='heada'><img src='"+data[i].draw_user_headimgurl+"' alt='头像'/></span> <span class='aaover'>"+data[i].draw_user_nickname+"</span><span>"+data[i].game_score+"掌"+"</span>"
                            str+="</li>"  ;
                        }
                        $(".phlis").html(str);

                        //获取pmboxs.高度
                        function getStyle(obj,attr){
                            if(obj.currentStyle){
                                return obj.currentStyle[attr];
                            }
                            else{
                                return document.defaultView.getComputedStyle(obj,null)[attr];
                            }
                        }
                        var winH=document.documentElement.clientHeight||document.body.clientHeight;//整屏的高度
                        var topH=$(".paihangTopW").height();
                        var pmH=$(".pm").height();
                        var conboxs=document.getElementById("conboxs");
                        var conboxsMt=getStyle(conboxs,"paddingTop");
                        var hs=document.getElementById("hs");
                        //var pmboxH=document.documentElement.clientHeight||document.body.clientHeight
                        var pmboxsH=winH-topH-pmH-parseInt(conboxsMt)-$("#hs").height();
                        $(".pmboxs").css("height",pmboxsH+"px");

                    }

                }

            });
        }else if($(this).index()==2){
            //请求我的奖品接口
            openid=localStorage.getItem("openid");
            var url4=urlType1+"xcbb_open/event/getMyPrize?openid="+openid;
            $.ajax({
                url:url4,    //请求的url地址
                dataType:"json",   //返回格式为json
                async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                type:"GET",   //请求方式
                cache:false,
                success:function(data){
                    if(data.success){
                        if(data.state=="001"){
                            var data=data.prize;
                            $("#zjtimes").html(data.prize_require_min_times);
                            $("#dj").html(data.prize_name);
                            $("#monery").html(data.prize_desc);
                        }else if(data.state=="002"){
                            $(".zj").html("暂未中奖记录")
                        }

                    }

                }

            });
        }
        $(this).addClass("current").siblings().removeClass("current");
        $(".conboxs .conbox").eq($(this).index()).show().siblings().hide();
    })

    //点击开刮按钮的时候
    $(".button1").click(function(){
        //点击开刮按钮的时候,需要告诉后台有一人参与 http://localhost:8081/xcbb_open/eventtj/game_user_tj/add
        var url7=urlType1+"xcbb_open/eventtj/game_user_tj/add ";
        $.ajax({
            url:url7,    //请求的url地址
            dataType:"json",   //返回格式为json
            async:true,//请求是否异步，默认为异步，这也是ajax重要特性
            type:"GET",   //请求方式
            cache:false,
            success:function(data){
                if(data.success){
                    console.log("调取人数接口成功")
                }else{
                    console.log("调取人数接口失败")
                }

            }

        });


        window.location.href="playStart.html?&urlType="+urlType;
    })

})
