/**
 * Created by wangxiaojin on 2017/4/12.
 */
$(function(){
	 var nexturl2=localStorage.getItem("nexturl");
	 if(nexturl2.indexOf("?")>0){
		 //说明存在?
		 nexturl2=nexturl2+"&isShare2=2";
	 }else {
		 nexturl2=nexturl2+"?isShare2=2";
	 }
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
        urlType="http://www.xiuktv.com/"
    }else{
        //说明是在www.
        /* urlType = "https://www.xcbobo.com/";*/
        urlType="https://www.xcbobo.com/";
        //urlType1="https://www.xcbobo.com/";
    }
   // var urlType=parameter().urlType;
    //公用参数
    var openid="";
    var sex=0;
    var nickname="";
    var city= "";
    var province= "";
    var country= "";
    var headimgurl= "";
    var device="";
    var cjtimes=""; //抽奖的次数
   // urlType
        openid=localStorage.getItem("openid");
        nickname=localStorage.getItem("nickname");
        city=localStorage.getItem("city");
        province=localStorage.getItem("province");
        country=localStorage.getItem("country");
        headimgurl=localStorage.getItem("headimgurl");
        device=localStorage.getItem("device");
        sex=localStorage.getItem("sex");
    //判断是安卓还是ios
//判断是ios还是安卓还是iPad还是pc
    var sUserAgent = navigator.userAgent.toLowerCase();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var IsIpad = "ipad" == sUserAgent.match(/ipad/i);
    var device="";
    if(isAndroid){
        device="android";
    }else if(isiOS){
        device="ios";
    }

//微信的配置和分享
    //获取jsapi签名信息接口http://www.xiuktv.com/xcbb_open/event/getJsapiSign?url=http://localhost:8081/xcbb_open/eventtj/pv
    /* var aaurl=localStorage.getItem("aaurl");*/
    var aaurl=encodeURIComponent(window.location.href);
    var url25=urlType+"xcbb_open/event/getJsapiSign?url="+aaurl;
    $.ajax({
        url:url25,    //请求的url地址
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

        },
        error:function(){
        	alert("error!")
        }

    });
    function weixinCallback (appId,timestamp,nonceStr,signature){
        //微信分享配置
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp:timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature:signature,// 必填，签名，见附录1
            jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        //判断当前客户端版本是否支持指定的js接口
        wx.ready(function(){
            var imgShareUrl=localStorage.getItem("headimgurl");
            /*var imgShareUrl=urlType+"xcbb_web/wh5/playFace/images/share.png";*/

            //如果支持分享给朋友圈的时候开始!
            
            wx.onMenuShareTimeline({
                title:'你敢来一起啪啪啪吗?', // 分享标题
                link:nexturl2,
                imgUrl: localStorage.getItem("headimgurl"), // 分享图标
                success: function () {
                	
                    // 用户确认分享后执行的回调函数 t=2 代表朋友圈分享成功
                    //请求分享成功接口 http://localhost:8081/xcbb_open/eventtj/share/save?openid=1222
                    var url20=urlType+"xcbb_open/eventtj/share/save?openid="+openid+"&type=2";
                    $.ajax({
                        url:url20,    //请求的url地址
                        dataType:"json",   //返回格式为json
                        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                        type:"GET",   //请求方式
                        cache:false,
                        success:function(data){
                            if(data.success){
                               console.log("分享接口请求成功111");
                              // window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx301d36d30e628ebf&redirect_uri=http://www.xiuktv.com/xcbb_web/wh5/playFace/index.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"

                            }else{
                                console.log("分享接口请求失败111");
                            }
                            window.location.href=urlType+"xcbb_web/wh5/playFace/playStart.html";
                           // window.location.href="playStart.html?&urlType="+urlType;
                        }

                    });
                    
                }
               
            });
            //如果支持分享给朋友圈的时候结束!
            //获取“分享给朋友”按钮点击状态及自定义分享内容接口开始
            var shareTitle='你敢来一起啪啪啪吗?';
           
            var aaName= localStorage.getItem("nickname");
            var desc=aaName+"正在 啪啪啪，邀请你来战!";
            wx.onMenuShareAppMessage({
                title: "你敢来一起啪啪啪吗?", // 分享标题
                desc: localStorage.getItem("nickname")+"正在 啪啪啪，邀请你来战!", // 分享描述
                link:nexturl2,
                imgUrl: localStorage.getItem("headimgurl"), // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                	
                    // 用户确认分享后执行的回调函数 t=1 代表是来自好友分享 t=2 代表来自朋友圈分享
                    var url11=urlType+"xcbb_open/eventtj/share/save?openid="+openid+"&type=1";
                    $.ajax({
                        url:url11,    //请求的url地址
                        dataType:"json",   //返回格式为json
                        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                        type:"GET",   //请求方式
                        cache:false,
                        success:function(data){
                            if(data.success){
                                console.log("分享接口请求成功1111");
                                //window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx301d36d30e628ebf&redirect_uri=http://www.xiuktv.com/xcbb_web/wh5/playFace/index.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
                            }else{
                                console.log("分享接口请求失败1111");
                            }
                            window.location.href=urlType+"xcbb_web/wh5/playFace/playStart.html?";
                            /*window.location.href="playStart.html?&urlType="+urlType;*/
                        }

                    });
                    
                }
            });
        })

    }
    $(".playagin").click(function(){
        window.location.href="playStart.html?urlType="+parameter().urlType;
    })

   
    $("#headImg").attr("src",headimgurl);
   
    var obgmusic=document.getElementById("bgmusic");
    var opaimusic=document.getElementById("paimusic");
    function is_weixn(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    if(is_weixn){
        function audioAutoPlay(id){
            var audio = document.getElementById(id);
            audio.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                audio.play();
            }, false);
        }
        audioAutoPlay("bgmusic");
        audioAutoPlay("paimusic");
    }
    $(".music").addClass("musicX");
    /* var zid = parameter().zid;*/
    var flag=1;//
    //点击music 的时候就让音乐停止
    /*$(".music").click(function(e){
     if(flag==1){
     flag=0;//代表音乐暂停
     obgmusic.pause();
     $(".music").removeClass("musicX");
     }else{
     flag=1;//代表开播音乐
     obgmusic.play();
     $(".music").addClass("musicX");
     }

     })*/
    /*
     * timeNum:时间开始10s
     * time2:十秒定时器
     * startFlag=1 证明已经开始游戏
     * jbgailv     击败的概率
     * */
    var timeNum=10000,time2=null,startFlag=0
    //点击游戏开始按钮的时候
    $(".startbut").click(function(){
        startFlag=1
        $(this).hide();
        $(".startingbut").show();
        var timeText=0;
        time2=setInterval(function(){
            timeNum=timeNum-6;
            if(timeNum<=0){
                startFlag=0;//时间到游戏结束
                //不打脸的时候,清空pai的声音
                $("#paimusic").attr("src","");
                $(".timeNum").html("0.00");
                clearInterval(time2);
                time2=null;
                $(".startingbut").hide();

                $(".startbut").show();
                $("#staraa").html("游戏结束")
                //游戏结束的时候,判断此时的巴掌数,如果大于等于88掌就进入了抽奖机会
                var paiNum=Number($(".leval").html());
                $(".playScore1").html(paiNum);

                window.setTimeout(function(){
                    //获取抽奖次数 http://www.xiuktv.com/xcbb_open/event/getTimes?openid=006
                    var url2=urlType+"xcbb_open/event/getTimes?openid="+openid+"&score="+paiNum;
                    $.ajax({
                        url:url2,    //请求的url地址
                        dataType:"json",   //返回格式为json
                        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
                        type:"GET",   //请求方式
                        cache:false,
                        success:function(data){
                            if(data.success){
                                //获取抽奖的次数
                                cjtimes=data.left_times;
                                $(".times").html(cjtimes);
                                $(".playScore").html(data.score);
                                if(!cjtimes){
                                    $(".choujiang").html("分享得抽奖机会");
                                }

                            }
                        }
                    });
                    if(paiNum>=66){
                        //游戏成功进入抽奖,让挑战成功的页面出现
                        $(".palyFail").hide();
                        $(".palySuccess").show();
                    }else{
                        //游戏失败
                        $(".palySuccess").hide();
                        $(".palyFail").show();
                    }
                },1000)
                return;
            }
            timeText=(timeNum/1000).toFixed(2);
            $(".timeNum").html(timeText);
        },1);
    })
    //点击打脸
    //获取打脸的video
    var ovideo2=document.getElementsByTagName("audio")[1];
    var paiNum= 0,paiflag=0;
    /*
     * paiNum:打脸的次数
     * paiflag:打左脸还是右脸
     * */
    var playbz=0
    var oclickSection=document.getElementById("clickSection")
    oclickSection.addEventListener('touchstart', dd, false);
    function dd(){
        if(startFlag==1){
            opaimusic.currentTime=0;
            opaimusic.play();
            paiNum++;
            $(".leval").html(paiNum);
            if(paiflag==0){
                paiflag=1;//打左脸
                $(".face").removeClass("rightFace");
                $(".face").addClass("leftFace");
            }else{
                paiflag=0 //打右脸
                $(".face").removeClass("leftFace");
                $(".face").addClass("rightFace");
            }
        }
    }

    //游戏结束之后,点击排行榜 让 排行榜出现
    $(".buttBottomRight").click(function(){


        //请求排行榜的接口:http://www.xiuktv.com/xcbb_open/event/getScore_top10
        var url3=urlType+"xcbb_open/event/getScore_top10";
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
        $(".paihang").show();
        $(".paihangTop li").removeClass("current");
        $(".paihangTop li").eq(1).addClass("current");
        $(".conbox").hide();
        $(".conbox").eq(1).show();
        /*$("#conboxs conbox").css("display","none");
         $("#conboxs conbox").eq(1).css("display","block");*/
    })
    //点击我的奖品的时候,请求相应的数据 http://www.xiuktv.com/xcbb_open/event/getMyPrize?openid=006
    $(".close").click(function(){
        $(".paihang").hide();
    })
    //点击排行榜上面的哪个li的时候就让相应的内容出现
    $(".paihangTop  li").click(function(){
        if($(this).index()==2){
            var url4=urlType+"xcbb_open/event/getMyPrize?openid="+openid;
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
                            /*$("#zjtimes").html(data.prize_require_min_times);*/
                            $("#dj").html(data.prize_name);
                            $("#monery").html(data.prize_desc);
                        }else if(data.state=="002"){
                            $(".zj").html("暂未中奖记录");
                        }

                    }

                }

            });

        }
        $(this).addClass("current").siblings().removeClass("current");
        $(".conboxs .conbox").eq($(this).index()).show().siblings().hide();
    })
    //游戏挑战成功之后,点击赶紧去抽奖,让抽奖的页面出现
    $(".choujiang").click(function(){
        /*点击抽奖的时候需要判定是不是还有抽奖机会 cjnum抽奖次数*/
        if(!cjtimes){ //证明还有抽奖次数,去请求是否中奖的接口
            $(".choujiang").css("backgroundImage","url('images/shareD.png')")
            $(".palySuccess").hide();
            $(".hongbaobox").show();
            $(".noChance").show();



            return;
        }
        $(".palySuccess").hide();
        $(".hongbaobox").show();
        $(".hongbao").show();
    })
    //点击红包的时候就让金币翻转
    $(".kai").click(function(){
        $(this).addClass("rotate");
        //点击开的时候,看看是否中奖
        /*http://www.xiuktv.com/xcbb_open/event/draw_prize?
         openid=003&nickname=5556&game_score=89&sex=1&city=changpin&province=bj&headimgurl=22222222&device=android6*/
        var url5=urlType+"xcbb_open/event/draw_prize?openid="+openid+"&nickname="+nickname+"&score="+paiNum+"&sex="+sex+"&city="+city+"&province="+province+"&headimgurl="+headimgurl+"&device="+device;
        $.ajax({
            url:url5,    //请求的url地址
            dataType:"json",   //返回格式为json
            async:true,//请求是否异步，默认为异步，这也是ajax重要特性
            type:"post",   //请求方式
            cache:false,
            success:function(data){
                if(data.success){
                    $(".hongbao").hide();
                    //data.state==001中奖
                    if(data.state=="003"){
                        var data=data.result;
                        //中奖
                        $(".faile").hide();
                        $(".zjinbi").show();
                        $("#zjname").html(nickname);
                        $("#adengjiang").html(data.prize_name);
                        $("#zjjinbia").html(data.prize_gold_count);
                        window.setTimeout(function(){
                            $(".sjbimg").hide();
                            $(".zjinbi .top").fadeIn();
                        },1500)

                    }else{
                        //未中奖
                        $(".zjinbi").hide();
                        $(".faile").show();
                        $(".play2").click(function(){
                            window.location.href="playStart.html?urlType="+parameter().urlType;
                        })
                    }
                }else{
                    alert("网络异常!");
                }

            }

        });
    })

})




