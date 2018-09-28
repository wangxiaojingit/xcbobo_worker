(function(){
    var desW=750;
    var w=document.documentElement.clientWidth||document.body.clientWidth;
    if(w>=desW){
      document.documentElement.style.fontSize="100px";
      return;
    }
    document.documentElement.style.fontSize=w/750*100+"px";

})()

//获取当前网址判定域名
var Wurl=window.location.href;
var base="",imgbase="";
if(Wurl.indexOf("www.xcbobo.com")>-1){
  base="https://www.xcbobo.com";
  imgbase="http://image.xcbobo.com/PubImgSour/game_pic/images/";
  baseimghead="http://image.xcbobo.com/PubImgSour/"
}else if(Wurl.indexOf("www.xiuktv.com")>-1){
  base="http://www.xiuktv.com";
  imgbase="http://www.xiuktv.com/PubImgSour/game_pic/images/";
  baseimghead="http://www.xiuktv.com/PubImgSour/"
}else if(Wurl.indexOf("127.0.0.1:8889")>-1){
  base="http://127.0.0.1:8889";
  imgbase="http://127.0.0.1:8889/PubImgSour/game_pic/images/";
  baseimghead="http://127.0.0.1:8889/PubImgSour/"
}else if(Wurl.indexOf("sc7btc.natappfree.cc")){
	base="http://sc7btc.natappfree.cc";
	imgbase="http://sc7btc.natappfree.cc/PubImgSour/game_pic/images/";
	baseimghead="http://sc7btc.natappfree.cc/PubImgSour/"

}
else{
  base="http://47.93.122.164";
  imgbase="http://47.93.122.164/PubImgSour/game_pic/images/";
  imghead="http://47.93.122.164/PubImgSour/"
}

//获取网址上的参数
function parameter(){
  var url=decodeURIComponent(document.location.href);
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


//禁止页面下拉
// window.onload = function(){
//       document.body.addEventListener("touchmove",function(event){
//          event.preventDefault();
//       });
//       document.body.addEventListener("touchstart",function(event){
//         event.preventDefault();
//       });
// };

