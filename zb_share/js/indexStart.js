/**
 * Created by prsoft on 2017/3/3.
 */
$(function(){
    //禁止页面向下拉动

    var sUserAgent = navigator.userAgent.toLowerCase();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var IsIpad = "ipad" == sUserAgent.match(/ipad/i);
    //域名
    var ymname="";
    if(document.location.href.indexOf("www.xcbobo.com")>1){
        ym="1";//如果ym=1就说明是www.xcbobo.com
        // ymname="http://www.xcbobo.com:8098";
        ymname="http://www.xcbobo.com";
    }else{
        ym="2" ;//如果ym=2就说明是www.xiuktv.com
        ymname="http://www.xiuktv.com";
    }
    //判断域名
    var downHref=""
    /*判定是安卓还是ios加载下载链接*/
    if(isAndroid){
        //downHref=ymname+"/xcbb_web/resources/download/anzhuo.apk";
    	downHref="http://a.app.qq.com/o/simple.jsp?pkgname=com.prsoft.xcshow&ckey=CK1365767037332";
        // $("#downloadRight").attr("href","http://www.xiuktv.com/xcbb_web/resources/download/anzhuo.apk");
    }else if(isiOS){
        downHref="https://itunes.apple.com/cn/app/id1191416714";
        //$("#downloadRight").attr("href","https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E6%92%AD%E6%92%AD-%E7%9C%9F%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9B%B4%E6%92%AD-k%E6%AD%8C%E5%A8%B1%E4%B9%90%E4%BA%A4%E5%8F%8B-%E6%B8%B8%E6%88%8F%E4%BA%92%E5%8A%A8-%E5%85%A8%E6%B0%91%E7%9B%B4%E6%92%AD%E7%A7%80%E5%9C%BA%E5%B9%B3%E5%8F%B0/id1016409459?mt=8")

    }else{
        downHref="http://www.xiuktv.com";
    }
    $("#startFmInR").attr("href",downHref);
    //获取网址上的参数
    function parameter(){
        var url=document.location.href;
        //  var url="http://www.xiuktv.com/xcbb_web/h5Activity/getSharePageInfo?zid=10004125&uid=10004122&type=1&sex=1&page=1&pageSize=100&token=123&province=111&nice=小辣"
        var obj={};
        var tem=[];
        var ary=url.split("?")[1].split("&");
        for(var i=0;i<ary.length;i++){
            var cur=ary[i];
            tem= cur.split("=");
            obj[tem[0]]=tem[1];
        }
        return obj;
    }

    //获取昵称
    var name=decodeURI(parameter().name);
    $("title").html(name+'直播间');
    //从原生那里获取热门服务列表的相关参数,从网址上获取
    var zid=parameter().zid;
    var uid=parameter().uid;
    var type=parameter().type;
    var name=decodeURI(parameter().name);
    var strUrl=ymname+"/xcbb_web/h5Activity/getSharePageInfo?zid="+zid+"&uid="+uid+"&type="+type;

    //判断是否在微信里打开
    function is_weixn(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    //点击暂停按钮的时候让进入播放页面
    $(".zt").click(function(){
        //点击开始直播的按钮,请求ajax,看是直播中的状态,还是结束的状态
        $.ajax({
            type: "get",
            dataType: "json",
            url: strUrl,
            success: function (data) {
                if (data != "") {
                    var islive = data.isLive;
                    if(islive){
                        var rtmburl=data.rtmburl;
                        //在直播中的状态
                        if(!isAndroid&&!isiOS&&!IsIpad){
                            //pc的状态
                            window.location.href="indexlivingPc.html?zid="+zid+"&uid="+uid+"&name="+name+"&type="+type+"&ym="+ym;
                        }else if(is_weixn()){
                            window.location.href="indexWeixin.html?zid="+zid+"&uid="+uid+"&name="+name+"&type="+type+"&ym="+ym+"&rtmburl="+rtmburl;
                        }else{
                            //跳转到移动端
                            window.location.href="indexShare.html?zid="+zid+"&uid="+uid+"&name="+name+"&type="+type+"&ym="+ym;
                        }

                    }else{
                        //结束的状态
                        window.location.href="indexEnd.html?zid="+zid+"&uid="+uid+"&name="+name+"&type="+type+"&ym="+ym;
                    }


                }
            }
        });




    })


})