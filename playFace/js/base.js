/**
 * Created by wangxiaojin on 2017/4/11.
 */

$(function(){
    ~function() {
        /*����ҳ�������Ӧ*/
        var desW = 720, winW = document.documentElement.clientWidth || document.body.clientWidth;
        var omain=document.getElementById("main");
        var ratio = winW / desW;
        if(winW>=720){
            omain.style.margin="0 auto";
            omain.style.width="720px";
            return;
        }
        document.documentElement.style.fontSize=ratio*100+"px";

    }()

    //��ȡ�ֻ��ĸ߶�
    var phoneH=document.documentElement.clientHeight||document.body.clientHeight;
    $("#main").css("height",phoneH+"px");

})