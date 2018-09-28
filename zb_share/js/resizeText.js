/**
 * Created by prsoft on 2017/3/3.
 */
~function(){
    /*����ҳ�������Ӧ*/
    var desW=750,winW=document.documentElement.clientWidth||document.body.clientWidth;
    var omain=document.getElementById("main");
    var startFm=document.getElementById("startFm");
    var ratio=winW/desW;

    document.documentElement.style.fontSize=ratio*100+"px";



    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android�ն�
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios�ն�
    var downHref=""
    /*�ж��ǰ�׿����ios������������*/
    if(isAndroid){

        downHref="http://www.xiuktv.com/xcbb_web/resources/download/anzhuo.apk";
        // $("#downloadRight").attr("href","http://www.xiuktv.com/xcbb_web/resources/download/anzhuo.apk");
    }else{
        downHref="https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E6%92%AD%E6%92%AD-%E7%9C%9F%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9B%B4%E6%92%AD-k%E6%AD%8C%E5%A8%B1%E4%B9%90%E4%BA%A4%E5%8F%8B-%E6%B8%B8%E6%88%8F%E4%BA%92%E5%8A%A8-%E5%85%A8%E6%B0%91%E7%9B%B4%E6%92%AD%E7%A7%80%E5%9C%BA%E5%B9%B3%E5%8F%B0/id1016409459?mt=8";
        //$("#downloadRight").attr("href","https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E6%92%AD%E6%92%AD-%E7%9C%9F%E4%BA%BA%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9B%B4%E6%92%AD-k%E6%AD%8C%E5%A8%B1%E4%B9%90%E4%BA%A4%E5%8F%8B-%E6%B8%B8%E6%88%8F%E4%BA%92%E5%8A%A8-%E5%85%A8%E6%B0%91%E7%9B%B4%E6%92%AD%E7%A7%80%E5%9C%BA%E5%B9%B3%E5%8F%B0/id1016409459?mt=8")

    }
    $("#startFmInR").attr("href",downHref);
    /*�ж��������pc�˴�*/
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) < 0) {
                $(".gifshowbox").css("margin-top","1rem");
            }
        }

    }
}();
