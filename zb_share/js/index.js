/**
 * Created by prsoft on 2017/2/23.
 */

$(function(){
//让直播的板块的高度等于手机一屏幕的高度
    var winH=document.documentElement.clientHeight;
    var winW=document.documentElement.clientWidth;
    var Ozbbox=document.getElementById("zbbox");
    var ofc=document.getElementById("fc");
    var omainIn=document.getElementById("mainIn");
    var ozhezhao=document.getElementById("zhezhao");

    Ozbbox.style.height=winH+"px";
    omainIn.style.height=winH+"px";
    ozhezhao.style.height=winH+"px";
    ofc.style.height=winH+"px";

    //获取网址上的参数
    function parameter(){
        var url=document.location.href;
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
  

    /*播放直播的视频,把直播视频追加到zbbox里面*/
    /*
    var player = new TcPlayer('zbbox', {
        "m3u8": flUrl,
       
        "autoplay" : true||false,      //iOS下safari浏览器是不开放这个能力的
        "coverpic" : "http://www.test.com/myimage.jpg",
        "width" : '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
        "height" :winH,//视频的显示高度，请尽量使用视频分辨率高度
        "wording": {
            2032: "请求视频失败，请检查网络",
            2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        }
    });*/
    /*---------------------------------------------------------初始化视频end-------------------------------------------------------*/


/*
 * 评论板块的特效模拟
 * 原理:根据动态的改变滚动条的距离来给人造成数据更新的假象
 *
 *
 * */

    window.setTimeout(function(){
        $('.comments').show(500,callback);
    },500)
    function callback(){
        var n=12;
        window.setInterval(function(){
            n+=10;
            /*这里的100是滚动条可以滚动的最大距离,达到这个值得话就让其等于0*/
            if(n>=100){
                n=0;
            }
            $('.comments').scrollTop(n);
        },1000)
    }
   
})

