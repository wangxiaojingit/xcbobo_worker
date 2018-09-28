/**
 * Created by wangxiaojin on 2017/4/11.
 */
var num= 0,timer=null;
$(function(){

	var lourl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx301d36d30e628ebf&redirect_uri=http://www.xiuktv.com/xcbb_web/wh5/playFace/index2.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
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
    
    
   
	if(!code){
			
			window.location.href=lourl;
	}
})
