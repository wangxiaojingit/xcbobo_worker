/**
 * Created by 王小金 on 2017/3/14.
 */


$(function () {
    //适配页面
    function Wresize() {
        var winW = document.documentElement.clientWidth || document.body.clientWidth;
        var omain = document.getElementById("main");
        var desW = 750;
        var ratio = winW / desW;
        if (winW > 750) {
            document.documentElement.style.fontSize = "100px";
            omain.style.width = "750px";
            omain.style.margin = "0 auto";
        }
        document.documentElement.style.fontSize = ratio * 100 + "px";
    };
    Wresize();
//判断是ios还是安卓还是iPad还是pc
    var sUserAgent = navigator.userAgent.toLowerCase();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var IsIpad = "ipad" == sUserAgent.match(/ipad/i);
//获取屏幕的宽
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    var winH = document.documentElement.clientWidth || document.body.clientHeight;

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

    var zid = parameter().zid;
    var uid = parameter().uid;
    var type = parameter().type;
    var name = decodeURI(parameter().name);
    var rtmp = "";//视频流
    var downHref = "";//下载链接
    var ym = parameter().ym;
    var lbs = parameter().lbs;//服务器string
    var lbsPort = parameter().lbsPort;//端口号Int
//给页面的title赋值
    $("title").html(name + "直播间");
    $(".nice").html(name);
//判定是在哪个域名下打开?如果ym=1,说明是在www.xcbobo.com下打开,如果是ym=2说明是在www.xiuktv.com下打开,同时定义头像的url;

    var ymname = "", ymnamePho = "", photo = "";
    if (ym == 1) {
        ymname = "http://www.xcbobo.com/";
        ymnamePho = "http://image.xcbobo.com";
    } else {
        ymname = "http://www.xiuktv.com/";
        ymnamePho = "http://www.xiuktv.com";
    }
    var strUrl = ymname + "/xcbb_web/h5Activity/getSharePageInfo?zid=" + zid + "&uid=" + uid + "&type=" + type + "&name=" + name;
//请求视频流,
    $.ajax({
        url: strUrl,
        type: "get",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: playInit
    })
    function playInit(data) {
        rtmp = data.rtmburl;
        photo = response.photo;
        //初始化视频播放器
        if (rtmp) {
            var player = new TcPlayer('videoBar', {
                "object-fit": 'fill',
                "x5-video-player-fullscreen": 'true',
                "x5-video-player-type": "h5",
                "m3u8": rtmp, //请替换成实际可用的播放地址
                "autoplay": true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                "width": winW,//视频的显示宽度，请尽量使用视频分辨率宽度
                "height": 'auto',//视频的显示高度，请尽量使用视频分辨率高度
                "wording": {
                    2032: "请求视频失败，请检查网络",
                    2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
                }
            });
        } else {
            console.log("没有找到视频流")
        }
        var ovideoBar = document.getElementById("videoBar");
        var videotag = ovideoBar.getElementsByTagName("video")[0];
        if (videotag) {
            videotag.setAttribute('x5-video-player-type', 'h5');
            videotag.setAttribute('x5-video-player-fullscreen', 'true');
            videotag.setAttribute('autoplay', true);
            videotag.setAttribute('object-fit', 'fill');
        }
        var resizeNum = 0
        window.setInterval(function () {
            $(window).resize(function () {
                //监听到手机的屏幕发生改变之后,我们要获取目前的手机屏幕的高度,改变视频外面的盒子的高度
                var screenH = document.documentElement.clientHeight || document.body.clientHeight;
                resizeNum++;
                if (resizeNum < 20 && isAndroid) {
                    $(".head").css("marginTop", "30px");
                }
                if (resizeNum > 20 && isAndroid) {
                    $(".head").css("marginTop", "0px");//用resizeNum来评估返回键,让礼物隐藏,尺寸不好适配.
                }
                $("#videoBar").css("height", screenH + 'px');
                $("#videoBar").css("overflow", "hidden");
                //此时送礼物的样式也得做下适配,如果屏幕的高度小于等于480的时候,我们需要把礼物的top值进行调试
            });
        }, 50);
        //添加头像的操作
        $(".headToplLeft").css("backgroundImage", ymnamePho + "/PubImgSour/" + photo + ".png");

        //关注的人数num
        var gznum = data.num;
        $(".gznum span").html(gznum);
    }

//如果是安卓了,给下载按钮添加安卓的,如果是iOS的添加ios,如果是pc或ipad就官网
    if (isAndroid) {
        downHref = ymname + "/xcbb_web/resources/download/anzhuo.apk";
        // $("#downloadRight").attr("href","http://www.xiuktv.com/xcbb_web/resources/download/anzhuo.apk");
    } else if (isiOS) {
        downHref = "https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E6%92%AD%E6%92%AD-%E7%9C%9F%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9B%B4%E6%92%AD-k%E6%AD%8C%E5%A8%B1%E4%B9%90%E4%BA%A4%E5%8F%8B-%E6%B8%B8%E6%88%8F%E4%BA%92%E5%8A%A8-%E5%85%A8%E6%B0%91%E7%9B%B4%E6%92%AD%E7%A7%80%E5%9C%BA%E5%B9%B3%E5%8F%B0/id1016409459?mt=8";
        //$("#downloadRight").attr("href","https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E6%92%AD%E6%92%AD-%E7%9C%9F%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9B%B4%E6%92%AD-k%E6%AD%8C%E5%A8%B1%E4%B9%90%E4%BA%A4%E5%8F%8B-%E6%B8%B8%E6%88%8F%E4%BA%92%E5%8A%A8-%E5%85%A8%E6%B0%91%E7%9B%B4%E6%92%AD%E7%A7%80%E5%9C%BA%E5%B9%B3%E5%8F%B0/id1016409459?mt=8")
    } else {
        downHref = "http://www.xiuktv.com";
    }
    $(".downButton").attr("href", downHref);
//点击关注/聊天/送礼的时候弹出下载提示框
    function tipDown(name) {
        $(name).click(function () {
            alert(1);
            $(".blackbg").show();
        })
    }
    tipDown(".headTopCenter");
    tipDown(".fcBottomTopLeft");
    tipDown(".gifbox");
    $(".zbFocus").click(function () {
        $(".blackbg").show();
    })
    //聊天区域逻辑
    /*
     * chartAry 存放聊天消息
     * 一旦有聊天data,就存放到chartAry里面
     * */
   //禁止手指在移动的过程中,把整个页面向下拉

    document.body.addEventListener('touchmove',function(e){
            e.returnValue=false;
            e.cancelBubble=true;
    });
    var Adatachat=null;//造的每条聊天内容
    var num=0;
    var chartAry = [];//只要接收到有聊天内容,就把Adatachat存放到这个数组中
    var chartAryTotal=[];//原始数组,不删除的,计算添加的条数
    var timeChart=null;//定时器
    function chart(){
        num++;
        Adatachat={"activeLevel":num,"activeLevelEffect":0,"cmd":"BTextChat","context":num,"guardType":0,"identity":2,"isguard":0,"nickname":"▔^▔","uid":"20001065"}
        if(Adatachat){
            if(Adatachat.activeLevel<= 20){
                Adatachat.djClass="dj1";
            }else if (Adatachat.activeLevel>= 21 && Adatachat.activeLevel <= 40) {
                Adatachat.djClass="dj2";
            } else if (Adatachat.activeLevel >= 41 && Adatachat.activeLevel <= 60) {
                Adatachat.djClass="dj3";
            } else if (Adatachat.activeLevel>= 61 && Adatachat.activeLevel <= 80) {
                Adatachat.djClass="dj4";
            } else if (Adatachat.activeLevel >= 81 && Adatachat.activeLevel<= 100) {
                Adatachat.djClass="dj5";
            } else if (Adatachat.activeLevel>= 101 ) {
                Adatachat.djClass="dj6";
            }
            chartAry.push(Adatachat);
            chartAryTotal.push(Adatachat);
        }
        //如果数据的条数>100的时候,我们就删除第一项;
        if(chartAryTotal.length>100){
            chartAryTotal.splice(0,1);
            $("#ocomments li:eq(0)").remove();
        }
        //去遍历聊天数组添加到页面中去
        if(chartAry.length){
            for(var i=0;i<chartAry.length;i++){
                //获取模板引擎字符串
                var templateChat=$("#templateChat").html();
                //result,得到是拼接在一起的数据和字符串
                var result= ejs.render(templateChat,{chatdata:chartAry});
                //在把数据追加到页面之前,我们需要判定一下等级,从而让$(".djIcon")出现相应的背景图.
                //把获取到的数据和字符串追加到页面中
                $(".comments").append(result);
                chartAry.splice(i,1);
                i--;
            }
        }
    }
    timeChart= window.setInterval(chart,2000);
    //给聊天添加滑动的效果
    var ocomments= document.getElementById("ocomments");
    //如果$("#ocomments").height>$(".chatBox").height()的高度的时候才可以执行滑动事件
    // if($("#ocomments").height()>$(".chatBox").height()){
    ocomments.addEventListener("touchstart",start,false);
    // }
    var n=20;
    function start(e){
        e.preventDefault();
        var target= e.touches[0];
        this.startX=target.clientX;
        this.startY=target.clientY;
        console.log(this.startY)
        this.addEventListener("touchmove",move,false);
        this.addEventListener("touchend",end,false);

    }
    function move(e){
        e.preventDefault();
        var target= e.touches[0];
        this.moveX=target.clientX;
        this.moveY=target.clientY;
        //大于一屏幕的高度才可以有滑动效果
        if($("#ocomments").height()>$(".chatBox").height()){
            if(this.moveY-this.startY>10){
                //说明存在下滑动,我们就应该先把定时器清除掉
                clearInterval(timeChart);
                //获取当前的ul的bottom值
                var cssBottom=parseInt(getStyle(this,'bottom'));
                //手指移动的距离
                var df=Math.abs(this.moveY-this.startY)+n;
                //边界判定,ul的bottom的最小值就是-mbottom;
                var mbottom=$("#ocomments").height()-$(".chatBox").height();
                //边界判定
                if(cssBottom-df>=-mbottom){
                    $(this).stop().animate({"bottom":cssBottom-df+"px"});
                   // $(this).css("bottom",cssBottom-df+"px");
                }else{
                    var ulh=-$("#ocomments").height()+$(".chatBox").height();
                    $(this).stop().animate({"bottom":ulh+"px"});
                }
            }else if(this.startY-this.moveY>10){
                //说明存在向上滑动,我们就应该先把定时器清除掉
                clearInterval(timeChart);
                var cssBottom=parseInt(getStyle(this,'bottom'));
                //获取当前的ul的bottom值
                var cssBottom=parseInt(getStyle(this,'bottom'));
                //手指移动的距离
                var df=Math.abs(this.startY-this.moveY)+n;
                //边界判定,ul的bottom的最大值就是0;
                if(cssBottom+df<=0){
                    $(this).stop().animate({"bottom":cssBottom+df+"px"});
                }else{
                    $(this).stop().animate({"bottom":"0px"});
                }
            }
            this.addEventListener("touchend",end,false);
        }

    }
    function end(e){
         e.preventDefault();
        this.removeEventListener("touchmove",move,false);
        this.removeEventListener("touchend",end,false);

        /* var target= e.changedTouches[0];
         this.endX=target.clientX;
         this.endY=target.clientY;
         if(this.endY-this.startY>10||this.startY-this.endY>10){*/
         //再次开启定时器
     // timeChart= window.setInterval(chart,2000);
        /* $(this).css("bottom","0px");

         }*/
    }
    //获取css样式
    function getStyle(obj, attr)
    {
        if(obj.currentStyle)
        {
            return obj.currentStyle[attr];
        }
        else
        {
            return getComputedStyle(obj,false)[attr];
        }
    }




    /*$t.swipeUp(ocomments, {
     start:function(e){
     var target=e.touches[0];
     ocomments.swipUpSatrtX=target.clientX;
     ocomments.swipUpSatrtY=target.clientY;
     },
     end: function (e) {
     var target=e.touches[0];
     ocomments.swipUpEndX=target.clientX;
     ocomments.swipUpEndY=target.clientY;
     // 当滑动结束的时候,我们就算出手指移动的纵坐标的位移
     var dy=ocomments.swipUpEndY-ocomments.swipUpSatrtY;
     console.log(dy);

     }
     });*/

//临时写死
    /* lbs = "47.93.118.164";
     lbsPort = 3001;
     var wsServer = "ws://" + lbs + ":" + lbsPort;*/

    /*
     function WebSocketTest() {
     if ("WebSocket" in window) {
     alert("您的浏览器支持 WebSocket!");
     // 打开一个 web socket
     var ws = new WebSocket(wsServer);
     console.log(ws.readyState);
     ws.onopen = function () {
     // Web Socket 已连接上，使用 send() 方法发送数据
     ws.send("发送数据");
     alert("数据发送中...");
     };

     ws.onmessage = function (evt) {
     var received_msg = evt.data;
     alert("数据已接收...");
     };
     ws.onclose = function () {
     // 关闭 websocket
     alert("连接已关闭...");
     };
     }
     else {
     // 浏览器不支持 WebSocket
     alert("您的浏览器不支持 WebSocket!");
     }
     }
     */

    // WebSocketTest();

});


